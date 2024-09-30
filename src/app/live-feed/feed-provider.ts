import { LiveFeedObject } from './feed-object';
import { Observable } from 'lib0/observable';
import * as url from 'lib0/url';
import * as math from 'lib0/math';
import * as time from 'lib0/time';
import * as encoding from 'lib0/encoding';
import * as decoding from 'lib0/decoding';
import * as syncProtocol from 'y-protocols/sync';
import * as Y from 'yjs';
import { messageYjsSyncStep1, messageYjsUpdate, readSyncMessage, writeUpdate } from './sync';
import { LiveFeedObjectUpdate, LiveFeedRoom } from './feed-room';

export const messageSync = 0;
export const messageQueryAwareness = 3;
export const messageAwareness = 1;
export const messageAuth = 2;

export interface LiveFeedProviderOptions {
    params: { [x: string]: string };
    WebSocketPolyfill: typeof WebSocket;
    connect: boolean;
}

export class LiveFeedProvider extends Observable<string> {
    room: LiveFeedRoom;
    options: LiveFeedProviderOptions;
    serverUrl: string;

    shouldConnect = false;
    hasConnected = false;
    connecting = false;
    unsuccessfulReconnects = 0;
    lastMessageReceived = 0;

    #synced = false;

    ws?: WebSocket | null;

    constructor(
        room: LiveFeedRoom,
        serverUrl: string,
        options: LiveFeedProviderOptions = { params: {}, WebSocketPolyfill: WebSocket, connect: true }
    ) {
        super();
        this.room = room;
        this.options = options;
        this.serverUrl = serverUrl;
        this.shouldConnect = options.connect;

        this.room.on('update', (updates: LiveFeedObjectUpdate[]) => {
            const pendingUpdates = updates.filter((value) => value.origin !== this);
            if (pendingUpdates.length > 0) {
                const encoder = encoding.createEncoder();
                encoding.writeVarUint(encoder, messageSync);
                encoding.writeVarUint(encoder, messageYjsUpdate);
                pendingUpdates.forEach((update) => {
                    encoding.writeVarString(encoder, update.guid);
                    encoding.writeVarUint8Array(encoder, update.update);
                });
                if (this.hasConnected && this.ws && this.ws.readyState === this.ws.OPEN) {
                    this.ws.send(encoding.toUint8Array(encoder));
                }
            }
        });
        if (options.connect) {
            this.connect();
        }
    }

    get url() {
        const encodedParams = url.encodeQueryParams(this.options.params);
        return this.serverUrl + '/' + this.room.roomId + (encodedParams.length === 0 ? '' : '?' + encodedParams);
    }

    connect() {
        console.log('connect');
        this.shouldConnect = true;
        if (!this.hasConnected && !this.ws) {
            setupWS(this);
        }
    }

    get synced() {
        return this.#synced;
    }

    set synced(state) {
        if (this.#synced !== state) {
            this.#synced = state;
            this.emit('synced', [state]);
        }
    }

    disconnect() {
        this.shouldConnect = false;
        if (this.ws) {
            this.ws.close();
        }
    }
}

const reconnectTimeoutBase = 1200;
const maxReconnectTimeout = 12000;
const messageReconnectTimeout = 60000;

const setupWS = (provider: LiveFeedProvider) => {
    if (provider.shouldConnect && !provider.ws) {
        console.log(provider.url);
        const websocket = new provider.options.WebSocketPolyfill(provider.url);
        websocket.binaryType = 'arraybuffer';
        provider.ws = websocket;
        provider.connecting = true;
        provider.hasConnected = false;
        provider.synced = false;

        websocket.onmessage = (event) => {
            provider.lastMessageReceived = time.getUnixTime();
            const encoder = readMessage(provider, new Uint8Array(event.data), true);
            if (encoding.length(encoder) > 1) {
                websocket.send(encoding.toUint8Array(encoder));
            }
        };

        websocket.onclose = () => {
            provider.ws = null;
            provider.connecting = false;
            if (provider.hasConnected) {
                provider.hasConnected = false;
                provider.synced = false;
                provider.emit('status', [
                    {
                        status: 'disconnected'
                    }
                ]);
            } else {
                provider.unsuccessfulReconnects++;
            }
            // Start with no reconnect timeout and increase timeout by
            // log10(unsuccessfulReconnects).
            // The idea is to increase reconnect timeout slowly and have no reconnect
            // timeout at the beginning (log(1) = 0)
            setTimeout(
                setupWS,
                math.min(math.log10(provider.unsuccessfulReconnects + 1) * reconnectTimeoutBase, maxReconnectTimeout),
                provider
            );
        };

        websocket.onopen = () => {
            provider.lastMessageReceived = time.getUnixTime();
            provider.connecting = false;
            provider.hasConnected = true;
            provider.unsuccessfulReconnects = 0;
            provider.emit('status', [
                {
                    status: 'connected'
                }
            ]);
            syncStep1(provider);
            const _syncInterval = setInterval(() => {
                if (!provider.synced && provider.hasConnected) {
                    syncStep1(provider);
                } else {
                    clearInterval(_syncInterval);
                }
            }, 1000);
        };

        provider.emit('status', [
            {
                status: 'connecting'
            }
        ]);
    }
};

const syncStep1 = (provider: LiveFeedProvider) => {
    // always send sync step 1 when connected
    const encoder = encoding.createEncoder();
    encoding.writeVarUint(encoder, messageSync);
    encoding.writeVarUint(encoder, messageYjsSyncStep1);
    provider.room.objects.forEach((value: LiveFeedObject) => {
        encoding.writeVarString(encoder, value.guid);
        const sv = Y.encodeStateVector(value);
        encoding.writeVarUint8Array(encoder, sv);
    });
    provider.ws?.send(encoding.toUint8Array(encoder));
};

const messageHandlers: any[] = [];
messageHandlers[messageSync] = (encoder: encoding.Encoder, decoder: decoding.Decoder, provider: LiveFeedProvider, emitSynced: boolean) => {
    encoding.writeVarUint(encoder, messageSync);
    const syncMessageType = readSyncMessage(decoder, encoder, provider.room, provider);
    if (emitSynced && syncMessageType === syncProtocol.messageYjsSyncStep2 && !provider.synced) {
        provider.synced = true;
    }
};

/**
 * @param {WebsocketProvider} provider
 * @param {Uint8Array} buf
 * @param {boolean} emitSynced
 * @return {encoding.Encoder}
 */
const readMessage = (provider: LiveFeedProvider, buf: Uint8Array, emitSynced: boolean) => {
    const decoder = decoding.createDecoder(buf);
    const encoder = encoding.createEncoder();
    const messageType = decoding.readVarUint(decoder);
    const messageHandler = messageHandlers[messageType];
    if (/** @type {any} */ messageHandler) {
        messageHandler(encoder, decoder, provider, emitSynced, messageType);
    } else {
        console.error('Unable to compute message');
    }
    return encoder;
};
