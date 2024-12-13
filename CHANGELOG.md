# Changelog

All notable changes to this project will be documented in this file. See [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) for commit guidelines.

## [0.0.21](https://github.com/worktile/ai-table/compare/0.0.20...0.0.21) (2024-12-13)


### Bug Fixes

* **field-property-editor:** add max-height and add overflow-y: auto for field-property-editor-panel #WIK-16855 ([#180](https://github.com/worktile/ai-table/issues/180)) ([d6571ff](https://github.com/worktile/ai-table/commit/d6571ffbdd2a25e3e87012bd876d9f37e7e230fe)), closes [#WIK-16855](https://github.com/worktile/ai-table/issues/WIK-16855)
* **file-menu:** assign insideClosable when open FieldMenu component #WIK-16898 ([#179](https://github.com/worktile/ai-table/issues/179)) ([ae9f2c8](https://github.com/worktile/ai-table/commit/ae9f2c8c1489cb5d18a9561a299f78b42bc7a263)), closes [#WIK-16898](https://github.com/worktile/ai-table/issues/WIK-16898)
* **grid:** do not use the last field's style to draw field blanks #WIK-16973 ([#185](https://github.com/worktile/ai-table/issues/185)) ([5531991](https://github.com/worktile/ai-table/commit/5531991cf51c8472a70f077f8c4aad07ad943249)), closes [#WIK-16973](https://github.com/worktile/ai-table/issues/WIK-16973)
* **grid:** fix error when table is no data and click add record button #WIK-16981 ([#189](https://github.com/worktile/ai-table/issues/189)) ([9cf8886](https://github.com/worktile/ai-table/commit/9cf8886901eb0c03e55d2c325547800ebebf8c8d)), closes [#WIK-16981](https://github.com/worktile/ai-table/issues/WIK-16981)


### Features

* **file:** distinguish single member field and multiple member field ([#181](https://github.com/worktile/ai-table/issues/181)) ([a095ccf](https://github.com/worktile/ai-table/commit/a095ccfe4aa7beda6daaa0eb4a19d366fb20f729))
* **grid:** activate type in the secondary menu of current field #WIK-16975 ([#184](https://github.com/worktile/ai-table/issues/184)) ([92d71a9](https://github.com/worktile/ai-table/commit/92d71a9afc49a4f7c68e87d2c01784ab3731d82a)), closes [#WIK-16975](https://github.com/worktile/ai-table/issues/WIK-16975)
* **grid:** support activate status when a single cell contextmenu is opened #WIK-16969 ([#188](https://github.com/worktile/ai-table/issues/188)) ([40a3ec3](https://github.com/worktile/ai-table/commit/40a3ec32d4324db914dd3d71f599336bd4565280)), closes [#WIK-16969](https://github.com/worktile/ai-table/issues/WIK-16969)
* **grid:** support open context menu and support delete records #WIK-16846 ([#182](https://github.com/worktile/ai-table/issues/182)) ([36b34c5](https://github.com/worktile/ai-table/commit/36b34c571f0002b969805684aef90c71f02480ef)), closes [#WIK-16846](https://github.com/worktile/ai-table/issues/WIK-16846)
* **grid:** support the active style of the row where the active cell is located #WIK-16965 ([#187](https://github.com/worktile/ai-table/issues/187)) ([ea23b96](https://github.com/worktile/ai-table/commit/ea23b9603190674384044bf6070893a5f27cea61)), closes [#WIK-16965](https://github.com/worktile/ai-table/issues/WIK-16965)



## [0.0.20](https://github.com/worktile/ai-table/compare/0.0.19...0.0.20) (2024-12-06)


### Bug Fixes

* **grid:** #WIK-16750  the remove icon  should be red on hover ([#177](https://github.com/worktile/ai-table/issues/177)) ([9a4113a](https://github.com/worktile/ai-table/commit/9a4113a29c8b77730e0913162f45738d277775a6)), closes [#WIK-16750](https://github.com/worktile/ai-table/issues/WIK-16750)



## [0.0.19](https://github.com/worktile/ai-table/compare/0.0.18...0.0.19) (2024-12-02)


### Features

* **core:** support short_id for record and view #WIK-16765 ([#175](https://github.com/worktile/ai-table/issues/175)) ([86a2473](https://github.com/worktile/ai-table/commit/86a24735f2757f9348198855208c400b71237bc5)), closes [#WIK-16765](https://github.com/worktile/ai-table/issues/WIK-16765)
* **icon:** modify more icon #WIK-16865 ([#174](https://github.com/worktile/ai-table/issues/174)) ([844fae2](https://github.com/worktile/ai-table/commit/844fae2ea75c5651d13426af79b9044207148294)), closes [#WIK-16865](https://github.com/worktile/ai-table/issues/WIK-16865)



## [0.0.18](https://github.com/worktile/ai-table/compare/0.0.17...0.0.18) (2024-11-28)


### Bug Fixes

* **field-edit:** fix edit field component unexpected close #WIK-16866 ([#172](https://github.com/worktile/ai-table/issues/172)) ([1082c19](https://github.com/worktile/ai-table/commit/1082c190d8edf9adc431f02799ba051a6321807c)), closes [#WIK-16866](https://github.com/worktile/ai-table/issues/WIK-16866)
* **grid:** fixed blank rendering of column headers for the last column in read-only mode #WIK-16864 ([#171](https://github.com/worktile/ai-table/issues/171)) ([477fef3](https://github.com/worktile/ai-table/commit/477fef3d429048c26c2fa0c91b8a88f6c60ec85b)), closes [#WIK-16864](https://github.com/worktile/ai-table/issues/WIK-16864)


### Features

* **config:**  support readonly mode #WIK-16851 ([#166](https://github.com/worktile/ai-table/issues/166)) ([c14926d](https://github.com/worktile/ai-table/commit/c14926dab393dd65ffd49c7e1790d57cf9bd02d0)), closes [#WIK-16851](https://github.com/worktile/ai-table/issues/WIK-16851)



## [0.0.17](https://github.com/worktile/ai-table/compare/0.0.16...0.0.17) (2024-11-27)


### Bug Fixes

* **field-head:** correct field more icon style and action #WIK-16740 ([08b0901](https://github.com/worktile/ai-table/commit/08b09016ff42b65c40afc06031376214821d3b43)), closes [#WIK-16740](https://github.com/worktile/ai-table/issues/WIK-16740)
* **field:** correct editFieldPosition #WIK-16748 ([5f46b69](https://github.com/worktile/ai-table/commit/5f46b6911f5ba6e6b90fc3825a5829e50e8b32c1)), closes [#WIK-16748](https://github.com/worktile/ai-table/issues/WIK-16748)
* **renderer:** support full width add blank #WIK-16745 ([90cc20b](https://github.com/worktile/ai-table/commit/90cc20bf08f9a9a109ced0c3956bb5a2dca59d6a)), closes [#WIK-16745](https://github.com/worktile/ai-table/issues/WIK-16745)
* **state:** #WIK-16805 new row coordination error ([2e21b9b](https://github.com/worktile/ai-table/commit/2e21b9b22c6aa8c7d9c42b41ca8e89f5b39e15b6)), closes [#WIK-16805](https://github.com/worktile/ai-table/issues/WIK-16805)


### Features

* **field:** support hover style for add field blank #WIK-16857 ([68a4248](https://github.com/worktile/ai-table/commit/68a424895a3b331008efc070f6997edd462f7e3a)), closes [#WIK-16857](https://github.com/worktile/ai-table/issues/WIK-16857)



## [0.0.16](https://github.com/worktile/ai-table/compare/0.0.15...0.0.16) (2024-11-25)


### Bug Fixes

* **actions:** fix select cell editor updated invalid value #WIK-16707 ([1350aa0](https://github.com/worktile/ai-table/commit/1350aa056210f40ff54ea4217ab25bad452da167)), closes [#WIK-16707](https://github.com/worktile/ai-table/issues/WIK-16707)


### Features

* **state:** support custom sharedType fieldName ([071392d](https://github.com/worktile/ai-table/commit/071392d15e0a8a1485070e23dc7d4c0e8a20f075))



## [0.0.15](https://github.com/worktile/ai-table/compare/0.0.14...0.0.15) (2024-10-22)


### Bug Fixes

* **editor:** fix date editor unexpected close #WIK-16685 ([70863d1](https://github.com/worktile/ai-table/commit/70863d12d32084a21235609e081d6155a91364de)), closes [#WIK-16685](https://github.com/worktile/ai-table/issues/WIK-16685)
* **shared:** build customFieldValues by fields array #WIK-16693 ([e12e485](https://github.com/worktile/ai-table/commit/e12e48528d8734a05d8a928f983e1f8f90f2c792)), closes [#WIK-16693](https://github.com/worktile/ai-table/issues/WIK-16693)


### Features

* **field:** improve system field data query logic #WIK-16680 ([0635a42](https://github.com/worktile/ai-table/commit/0635a422cc361faf2c33a62a0b9e6a26bb2ed58a)), closes [#WIK-16680](https://github.com/worktile/ai-table/issues/WIK-16680)
* **operation:** support update system field value operation and yjs translate #WIK-16689 ([b20503d](https://github.com/worktile/ai-table/commit/b20503db35f82ee0bee69b07c36796ff25454021)), closes [#WIK-16689](https://github.com/worktile/ai-table/issues/WIK-16689)
* **state:** support update updatedInfo when add field and remove field #WIK-16696 ([92b8a97](https://github.com/worktile/ai-table/commit/92b8a97fc46a6e094a5cc670f69614feed552d65)), closes [#WIK-16696](https://github.com/worktile/ai-table/issues/WIK-16696)



## [0.0.14](https://github.com/worktile/ai-table/compare/0.0.13...0.0.14) (2024-10-16)


### Features

* improve rating and progress editor and field default value ([4d364a8](https://github.com/worktile/ai-table/commit/4d364a87ed37d589772f561aaa8af47e87c46596))



## [0.0.13](https://github.com/worktile/ai-table/compare/0.0.12...0.0.13) (2024-10-15)


### Bug Fixes

* adjust  drawable index ([#122](https://github.com/worktile/ai-table/issues/122)) ([d3776f8](https://github.com/worktile/ai-table/commit/d3776f8f79fce550c4de9c90b0530d5bbddac00a))
* align progress editor and rating editor ([9d27ddf](https://github.com/worktile/ai-table/commit/9d27ddffe297018b14480c4a414e04b8a87d0ccc))
* cellValue to transformValue ([#126](https://github.com/worktile/ai-table/issues/126)) ([3fb4efd](https://github.com/worktile/ai-table/commit/3fb4efd96ee2db42bfc14ad2c62cb16628fff1dc))
* correct link editor style ([3378946](https://github.com/worktile/ai-table/commit/3378946e73815ae3a55ecfdd402bb6ed367034f4))
* correct number editor align ([14ca50c](https://github.com/worktile/ai-table/commit/14ca50c8dde5f036c8320ad5cd402b9063590f18))
* correct origin position when scrolling ([6257cbe](https://github.com/worktile/ai-table/commit/6257cbe1af604dc5992624b99d7f66e9edc08d08))
* **edit:** fix edit style and position ([#117](https://github.com/worktile/ai-table/issues/117)) ([de2ec7a](https://github.com/worktile/ai-table/commit/de2ec7aa42462456c64cba2aaa41e1f213cd67dd))
* fix hover checkbox change color ([#132](https://github.com/worktile/ai-table/issues/132)) ([86feb13](https://github.com/worktile/ai-table/commit/86feb1398317bcf382f31a5974d512ea2009b17e))
* fix link editor error ([#131](https://github.com/worktile/ai-table/issues/131)) ([72cf6ed](https://github.com/worktile/ai-table/commit/72cf6edf0b43cae1ebda7dbc3221924a27c7854b))
* fix tag display when multiple select ([#125](https://github.com/worktile/ai-table/issues/125)) ([a6c6d39](https://github.com/worktile/ai-table/commit/a6c6d391e81061cbb3c77cf88cd0cfafa09e49a0))
* fix type error ([#123](https://github.com/worktile/ai-table/issues/123)) ([802cdc0](https://github.com/worktile/ai-table/commit/802cdc00949a5109eec7746c626a9b3010593476))
* **grid:** end the opened edit when clicking on the switch cell #WIK-16660 ([1be6f3f](https://github.com/worktile/ai-table/commit/1be6f3f250e30ef82e08b308a444a811f2a1b680)), closes [#WIK-16660](https://github.com/worktile/ai-table/issues/WIK-16660)
* **grid:** fix dom render error #WIK-16537 ([#105](https://github.com/worktile/ai-table/issues/105)) ([92927be](https://github.com/worktile/ai-table/commit/92927bee338d5369aa1c64e4e14d5835805a884b)), closes [#WIK-16537](https://github.com/worktile/ai-table/issues/WIK-16537)
* **grid:** fix the position and error of the add column popup window ([#142](https://github.com/worktile/ai-table/issues/142)) ([d58a5e4](https://github.com/worktile/ai-table/commit/d58a5e47af9294773b111e749375c1ce5f5b81d4))
* **grid:** fix the style and color error of the selected option #WIK-16677 ([83bd54d](https://github.com/worktile/ai-table/commit/83bd54df0601dd123a4cb328d4b9352823e411c7)), closes [#WIK-16677](https://github.com/worktile/ai-table/issues/WIK-16677)
* **grid:** fix the style and color error of the selected option #WIK-16677 ([3e637c7](https://github.com/worktile/ai-table/commit/3e637c712ef1b84c3292c25013363e55d7470154)), closes [#WIK-16677](https://github.com/worktile/ai-table/issues/WIK-16677)
* **grid:** restore code in origin develop #WIK-16519 ([#119](https://github.com/worktile/ai-table/issues/119)) ([0667869](https://github.com/worktile/ai-table/commit/066786911635a99a4cfa158cb90b545e53c13898)), closes [#WIK-16519](https://github.com/worktile/ai-table/issues/WIK-16519)
* link icon ([#146](https://github.com/worktile/ai-table/issues/146)) ([9b94203](https://github.com/worktile/ai-table/commit/9b9420300728d5a8375c173245e463ef1bf80f66))
* **number-editor:** fix number editor style ([00acc0a](https://github.com/worktile/ai-table/commit/00acc0a2a31f67a61f7f3342d02c82d6cb9d4ff7))
* **select:** fix draw dot ([#115](https://github.com/worktile/ai-table/issues/115)) ([ea348f7](https://github.com/worktile/ai-table/commit/ea348f7997857e07352334ebe78572dad0908887))
* 增加单选数据 ([#109](https://github.com/worktile/ai-table/issues/109)) ([c5f42c9](https://github.com/worktile/ai-table/commit/c5f42c96a76fd710563fb7b5d89d69baf294f81f))


### Features

* add build linear row and coordinate ([#74](https://github.com/worktile/ai-table/issues/74)) ([f309bb6](https://github.com/worktile/ai-table/commit/f309bb631f581c8627547d44e5227f607bf0869a))
* add field and add record and selection and hover #WIK-16306 ([#88](https://github.com/worktile/ai-table/issues/88)) ([60d835b](https://github.com/worktile/ai-table/commit/60d835b9bb2f0d2c4d630c87c5e5e9bb01b2a314)), closes [#WIK-16306](https://github.com/worktile/ai-table/issues/WIK-16306)
* add grid renderer ([ecfad4e](https://github.com/worktile/ai-table/commit/ecfad4e9bbb32c90ba42c915a0b0c7c8e34a4f02))
* **addField:** add field column ([#86](https://github.com/worktile/ai-table/issues/86)) ([7f78625](https://github.com/worktile/ai-table/commit/7f786253c139b21dc78c4b25523eb38c122e6569))
* **editor:** remove 2px border of editor and refactor position logic ([#145](https://github.com/worktile/ai-table/issues/145)) ([af9a1ce](https://github.com/worktile/ai-table/commit/af9a1ce9ad23a8de02e951b4c9ad8568eb6d57de))
* **editor:** set different editor style by the editor has border or not ([f8b362e](https://github.com/worktile/ai-table/commit/f8b362e5f24593d91ec421c57b51a03057dc7b40))
* **head:** create heads ([#82](https://github.com/worktile/ai-table/issues/82)) ([569e90a](https://github.com/worktile/ai-table/commit/569e90ae63e645ad23f9749e281cd55170a4f2a3))
* **icon-renderer:** modified check/checked icon #WIK-16614 ([7e1a019](https://github.com/worktile/ai-table/commit/7e1a0192adcdcf6b7dc649b96ef3dedbaf29cdde)), closes [#WIK-16614](https://github.com/worktile/ai-table/issues/WIK-16614)
* **renderer:** correct text icon ([eb5c71e](https://github.com/worktile/ai-table/commit/eb5c71e15a2803f9e861703bb06b497b032c7c86))
* **renderer:** support link ([#129](https://github.com/worktile/ai-table/issues/129)) ([caeb600](https://github.com/worktile/ai-table/commit/caeb600a404b1429ac0d3539247543c743cd27d2))
* **scrolling:** support scroll action when cell is editing #WIK-16633 ([#130](https://github.com/worktile/ai-table/issues/130)) ([4eaf3e7](https://github.com/worktile/ai-table/commit/4eaf3e7519ce9a6c4ed407287b86fcc75570bdc9)), closes [#WIK-16633](https://github.com/worktile/ai-table/issues/WIK-16633)
* **single-select:**  support different type select ([#108](https://github.com/worktile/ai-table/issues/108)) ([1a33675](https://github.com/worktile/ai-table/commit/1a33675a8ae19aaf9ef907fb0391d406bd58f594))
* support multiple select ([#120](https://github.com/worktile/ai-table/issues/120)) ([f102df3](https://github.com/worktile/ai-table/commit/f102df353cd006f29a1844ad95d42bd82f6c247d))



## [0.0.12](https://github.com/worktile/ai-table/compare/0.0.11...0.0.12) (2024-09-18)

### Features

-   **state:** support sort records when is_keep_sort is true #WIK-16424 ([#100](https://github.com/worktile/ai-table/issues/100)) ([587b575](https://github.com/worktile/ai-table/commit/587b575caa94d5695ba06df25107e8dbd8242751)), closes [#WIK-16424](https://github.com/worktile/ai-table/issues/WIK-16424)

## [0.0.11](https://github.com/worktile/ai-table/compare/0.0.10...0.0.11) (2024-09-12)

### Bug Fixes

-   bump ngx-tethys and adjust popover input value #WIK-16493 ([#98](https://github.com/worktile/ai-table/issues/98)) ([718de81](https://github.com/worktile/ai-table/commit/718de813759a05e22e0944e0b3fa421f201622f7)), closes [#WIK-16493](https://github.com/worktile/ai-table/issues/WIK-16493)

## [0.0.10](https://github.com/worktile/ai-table/compare/0.0.9...0.0.10) (2024-09-11)

### Bug Fixes

-   adjust date render and exec field menu function #WIK-16486 ([#94](https://github.com/worktile/ai-table/issues/94)) ([cc59fca](https://github.com/worktile/ai-table/commit/cc59fca7cf394a170dc1f299459fba63ca97be12)), closes [#WIK-16486](https://github.com/worktile/ai-table/issues/WIK-16486)

### Features

-   **core:** add aiBuildRenderDataFn input and update single select type value to array #WIK-16086 ([#92](https://github.com/worktile/ai-table/issues/92)) ([3177bf3](https://github.com/worktile/ai-table/commit/3177bf35bf7408714d94e7d2824cd209521775e0)), closes [#WIK-16086](https://github.com/worktile/ai-table/issues/WIK-16086)
-   **state:** support add and remove record position ([#84](https://github.com/worktile/ai-table/issues/84)) ([d57428a](https://github.com/worktile/ai-table/commit/d57428aabb2a4050b1dc99e18c47891be172a7e7))
-   **state:** support filter records function#WIK-16463 ([#95](https://github.com/worktile/ai-table/issues/95)) ([83f750b](https://github.com/worktile/ai-table/commit/83f750b312d4fa3faedf206b48f212c587c85021)), closes [function#WIK-16463](https://github.com/function/issues/WIK-16463)

## [0.0.9](https://github.com/worktile/ai-table/compare/0.0.8...0.0.9) (2024-08-27)

### Bug Fixes

-   **grid:** fix select type error when type is multiple ([#77](https://github.com/worktile/ai-table/issues/77)) ([10be512](https://github.com/worktile/ai-table/commit/10be5124166a5da8d359cf6d51ccb074ae5fa8c2))
-   **grid:** optimize pipe #WIK-16303 ([#76](https://github.com/worktile/ai-table/issues/76)) ([4e219e7](https://github.com/worktile/ai-table/commit/4e219e7b3f9f19ab496bac9d8fcc0623849cc608)), closes [#WIK-16303](https://github.com/worktile/ai-table/issues/WIK-16303)

## [0.0.8](https://github.com/worktile/ai-table/compare/0.0.7...0.0.8) (2024-08-22)

## [0.0.7](https://github.com/worktile/ai-table/compare/0.0.6...0.0.7) (2024-08-21)

### Bug Fixes

-   close edit component and add space to default field name #WIK-16285 ([#49](https://github.com/worktile/ai-table/issues/49)) ([13abbb4](https://github.com/worktile/ai-table/commit/13abbb441c7206811707614a51ef7ecd009e9dd3)), closes [#WIK-16285](https://github.com/worktile/ai-table/issues/WIK-16285)
-   fix autofill position #WIK-16275 ([#50](https://github.com/worktile/ai-table/issues/50)) ([8b9e427](https://github.com/worktile/ai-table/commit/8b9e427d13f3408674cc286331d040da92b110a1)), closes [#WIK-16275](https://github.com/worktile/ai-table/issues/WIK-16275)

### Features

-   add shared package and move view handle to shared #WIK-16315 ([#52](https://github.com/worktile/ai-table/issues/52)) ([8ab9e22](https://github.com/worktile/ai-table/commit/8ab9e227b7901cb3bf3835bd9b29050e221f51f3)), closes [#WIK-16315](https://github.com/worktile/ai-table/issues/WIK-16315)
-   refactor add_record and add_field #WIK-16330 ([#56](https://github.com/worktile/ai-table/issues/56)) ([92359ff](https://github.com/worktile/ai-table/commit/92359ff04bd71f97586ee4eb8f8ed73b19b3b7f0)), closes [#WIK-16330](https://github.com/worktile/ai-table/issues/WIK-16330)
-   refactor idCreator #WIK-16347 ([#60](https://github.com/worktile/ai-table/issues/60)) ([88a8259](https://github.com/worktile/ai-table/commit/88a82598e3e22081a67c6505c819ef8805c645ea)), closes [#WIK-16347](https://github.com/worktile/ai-table/issues/WIK-16347)
-   refactor update field value action #WIK-16327 ([#54](https://github.com/worktile/ai-table/issues/54)) ([bd3a7c4](https://github.com/worktile/ai-table/commit/bd3a7c46d71a26afab49c1db76e2cab500e59051)), closes [#WIK-16327](https://github.com/worktile/ai-table/issues/WIK-16327)
-   support add view and remove view #WIK-16293 ([#62](https://github.com/worktile/ai-table/issues/62)) ([0585ed7](https://github.com/worktile/ai-table/commit/0585ed737dcbc12bb99565c8454a3706a10b1df1)), closes [#WIK-16293](https://github.com/worktile/ai-table/issues/WIK-16293)
-   support remove shared #WIK-16331 ([#58](https://github.com/worktile/ai-table/issues/58)) ([9cac388](https://github.com/worktile/ai-table/commit/9cac388d0eded4154dbd1eb6a53de4a215c94b28)), closes [#WIK-16331](https://github.com/worktile/ai-table/issues/WIK-16331)
-   support set field shared #WIK-16344 ([#59](https://github.com/worktile/ai-table/issues/59)) ([a3377e4](https://github.com/worktile/ai-table/commit/a3377e4cf727ca450efb16da885c68c01595e006)), closes [#WIK-16344](https://github.com/worktile/ai-table/issues/WIK-16344)

## [0.0.6](https://github.com/worktile/ai-table/compare/0.0.4...0.0.6) (2024-08-08)

### Bug Fixes

-   click action not select col ([012f651](https://github.com/worktile/ai-table/commit/012f651a318096aae636940153469858da330094))
-   **grid:** fix the layout jitter caused by the style when the edit component pops up #WIK-16177 ([#35](https://github.com/worktile/ai-table/issues/35)) ([d79a0c7](https://github.com/worktile/ai-table/commit/d79a0c7babdb2ce25a1edec427fb1c68568e4291)), closes [#WIK-16177](https://github.com/worktile/ai-table/issues/WIK-16177)
-   set member default value to [] ([#45](https://github.com/worktile/ai-table/issues/45)) ([3c61df7](https://github.com/worktile/ai-table/commit/3c61df7d99e7ed17f460303da983cea960e1e8c4))

### Features

-   add createdAt and updatedAt field type #WIK-16252 ([#41](https://github.com/worktile/ai-table/issues/41)) ([254e468](https://github.com/worktile/ai-table/commit/254e468a9fbc9230e517bced09eae351d5d3eadc)), closes [#WIK-16252](https://github.com/worktile/ai-table/issues/WIK-16252)
-   build action before apply yjs #WIK-16236 ([#39](https://github.com/worktile/ai-table/issues/39)) ([0d954f2](https://github.com/worktile/ai-table/commit/0d954f253a313053db6ae45e7b3e3be4fb6862f1)), closes [#WIK-16236](https://github.com/worktile/ai-table/issues/WIK-16236)
-   **grid:** add clear selection condition ([#37](https://github.com/worktile/ai-table/issues/37)) ([5a196bc](https://github.com/worktile/ai-table/commit/5a196bca3911a5c90d013e25631a7d1fbfbc34c0))
-   **grid:** hover editing component supports selection #WIK-16107 ([#36](https://github.com/worktile/ai-table/issues/36)) ([17f01d5](https://github.com/worktile/ai-table/commit/17f01d5b3a81ed11377cc51888e50e22020406a4)), closes [#WIK-16107](https://github.com/worktile/ai-table/issues/WIK-16107)
-   **positions:** build data by positions and active views #WIK-16218 ([#29](https://github.com/worktile/ai-table/issues/29)) ([8896808](https://github.com/worktile/ai-table/commit/88968087cbf6979544e9c7c3a3f7d7dbfeb6c8fa)), closes [#WIK-16218](https://github.com/worktile/ai-table/issues/WIK-16218)
-   render member #WIK-16256 ([#42](https://github.com/worktile/ai-table/issues/42)) ([7e7bb52](https://github.com/worktile/ai-table/commit/7e7bb52f7afea5cb5be682647194d00f377ba9c1)), closes [#WIK-16256](https://github.com/worktile/ai-table/issues/WIK-16256)
-   support views share #WIK-16187 ([#22](https://github.com/worktile/ai-table/issues/22)) ([93e28ab](https://github.com/worktile/ai-table/commit/93e28abf7154e9cff0d7404af7b033ce81841396)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.5](https://github.com/worktile/ai-table/compare/0.0.4...0.0.5) (2024-08-08)

### Bug Fixes

-   click action not select col ([012f651](https://github.com/worktile/ai-table/commit/012f651a318096aae636940153469858da330094))
-   **grid:** fix the layout jitter caused by the style when the edit component pops up #WIK-16177 ([#35](https://github.com/worktile/ai-table/issues/35)) ([d79a0c7](https://github.com/worktile/ai-table/commit/d79a0c7babdb2ce25a1edec427fb1c68568e4291)), closes [#WIK-16177](https://github.com/worktile/ai-table/issues/WIK-16177)

### Features

-   add createdAt and updatedAt field type #WIK-16252 ([#41](https://github.com/worktile/ai-table/issues/41)) ([254e468](https://github.com/worktile/ai-table/commit/254e468a9fbc9230e517bced09eae351d5d3eadc)), closes [#WIK-16252](https://github.com/worktile/ai-table/issues/WIK-16252)
-   build action before apply yjs #WIK-16236 ([#39](https://github.com/worktile/ai-table/issues/39)) ([0d954f2](https://github.com/worktile/ai-table/commit/0d954f253a313053db6ae45e7b3e3be4fb6862f1)), closes [#WIK-16236](https://github.com/worktile/ai-table/issues/WIK-16236)
-   **grid:** add clear selection condition ([#37](https://github.com/worktile/ai-table/issues/37)) ([5a196bc](https://github.com/worktile/ai-table/commit/5a196bca3911a5c90d013e25631a7d1fbfbc34c0))
-   **grid:** hover editing component supports selection #WIK-16107 ([#36](https://github.com/worktile/ai-table/issues/36)) ([17f01d5](https://github.com/worktile/ai-table/commit/17f01d5b3a81ed11377cc51888e50e22020406a4)), closes [#WIK-16107](https://github.com/worktile/ai-table/issues/WIK-16107)
-   **positions:** build data by positions and active views #WIK-16218 ([#29](https://github.com/worktile/ai-table/issues/29)) ([8896808](https://github.com/worktile/ai-table/commit/88968087cbf6979544e9c7c3a3f7d7dbfeb6c8fa)), closes [#WIK-16218](https://github.com/worktile/ai-table/issues/WIK-16218)
-   render member #WIK-16256 ([#42](https://github.com/worktile/ai-table/issues/42)) ([7e7bb52](https://github.com/worktile/ai-table/commit/7e7bb52f7afea5cb5be682647194d00f377ba9c1)), closes [#WIK-16256](https://github.com/worktile/ai-table/issues/WIK-16256)
-   support views share #WIK-16187 ([#22](https://github.com/worktile/ai-table/issues/22)) ([93e28ab](https://github.com/worktile/ai-table/commit/93e28abf7154e9cff0d7404af7b033ce81841396)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.4](https://github.com/worktile/ai-table/compare/0.0.3...0.0.4) (2024-08-02)

### Features

-   **action:** add AIPlugin ([#18](https://github.com/worktile/ai-table/issues/18)) ([024fa5f](https://github.com/worktile/ai-table/commit/024fa5fa8502febddef9b0b8ac1cc4802dc30451))
-   add shared demo ([#15](https://github.com/worktile/ai-table/issues/15)) ([488a8e1](https://github.com/worktile/ai-table/commit/488a8e182daa5d0d8709153b87e3256c4c7239b5))
-   apply icon and width #WIK-16166 ([cf46f10](https://github.com/worktile/ai-table/commit/cf46f102e5471ca19ed873e4daf0642cb4066ec3)), closes [#WIK-16166](https://github.com/worktile/ai-table/issues/WIK-16166)
-   **core:** add set_field action #WIK-16194 ([#20](https://github.com/worktile/ai-table/issues/20)) ([6b34150](https://github.com/worktile/ai-table/commit/6b34150b78058da8b8f1b9e60e97524b6165abee)), closes [#WIK-16194](https://github.com/worktile/ai-table/issues/WIK-16194)
-   **core:** support move_record and move_field #WIK-16196 ([#24](https://github.com/worktile/ai-table/issues/24)) ([3ebf3fc](https://github.com/worktile/ai-table/commit/3ebf3fc7801fb7780cc118388f5418ae8992a483)), closes [#WIK-16196](https://github.com/worktile/ai-table/issues/WIK-16196)
-   **core:** support remove_field and remove_record #WIK-16192 ([#19](https://github.com/worktile/ai-table/issues/19)) ([2bc106e](https://github.com/worktile/ai-table/commit/2bc106ebbae3305e17ec2592ab3422c3042a46b4)), closes [#WIK-16192](https://github.com/worktile/ai-table/issues/WIK-16192)
-   **demo:** add shared demo #WIK-16223 ([#27](https://github.com/worktile/ai-table/issues/27)) ([009a234](https://github.com/worktile/ai-table/commit/009a2348d9336fb111605b04c9ac18087a53725c)), closes [#WIK-16223](https://github.com/worktile/ai-table/issues/WIK-16223)
-   **demo:** add ws server ([#23](https://github.com/worktile/ai-table/issues/23)) ([bd7bf6b](https://github.com/worktile/ai-table/commit/bd7bf6b1db525954dd5e35f4f83343066382640d))
-   **selection:** add selection feature #WIK-16060 ([#12](https://github.com/worktile/ai-table/issues/12)) ([0392723](https://github.com/worktile/ai-table/commit/039272385a3b32f6d0a874e863a9a1d87301f8c0)), closes [#WIK-16060](https://github.com/worktile/ai-table/issues/WIK-16060)
-   **types:** adjust field type and record value #WIK-16187 ([#21](https://github.com/worktile/ai-table/issues/21)) ([2938add](https://github.com/worktile/ai-table/commit/2938add3ebf4497b0367b6499bc8c163c395dc3b)), closes [#WIK-16187](https://github.com/worktile/ai-table/issues/WIK-16187)

## [0.0.3](https://github.com/worktile/ai-table/compare/0.0.2...0.0.3) (2024-07-22)

### Features

-   support add and extend field #WIK-16038 ([#10](https://github.com/worktile/ai-table/issues/10)) ([74edbbb](https://github.com/worktile/ai-table/commit/74edbbbca3f387454bb22f436eaef0f67367b5e1)), closes [#WIK-16038](https://github.com/worktile/ai-table/issues/WIK-16038)

## 0.0.2 (2024-07-16)

## 0.0.1 (2024-07-15)

### Features

-   **grid:** move event listener to AITableGridEventService #WIK-15924 ([#3](https://github.com/worktile/v-table/issues/3)) ([b15621f](https://github.com/worktile/v-table/commit/b15621f1815fe80569aaf4feae95c510618bef19)), closes [#WIK-15924](https://github.com/worktile/v-table/issues/WIK-15924)
-   **grid:** support dateTime editor #WIK-16048 ([#4](https://github.com/worktile/v-table/issues/4)) ([090cd8a](https://github.com/worktile/v-table/commit/090cd8ae4eeb8dda20e4991108ed2bc6684501bd)), closes [#WIK-16048](https://github.com/worktile/v-table/issues/WIK-16048)
-   **grid:** support display rating and link field #WIK-16072 ([#5](https://github.com/worktile/v-table/issues/5)) ([eaf0172](https://github.com/worktile/v-table/commit/eaf017222ba62edfdbd3774b63c3a245eafa0681)), closes [#WIK-16072](https://github.com/worktile/v-table/issues/WIK-16072)
-   **grid:** support number editor #WIK-16029 ([#2](https://github.com/worktile/v-table/issues/2)) ([b9fbfbc](https://github.com/worktile/v-table/commit/b9fbfbcf698f48e6a2e18f123dd24b78d21ff51c)), closes [#WIK-16029](https://github.com/worktile/v-table/issues/WIK-16029)
-   init ai table ([#1](https://github.com/worktile/v-table/issues/1)) ([224c0dd](https://github.com/worktile/v-table/commit/224c0dd6cba2bf3fc9f419a27b1d3b043af46955))
