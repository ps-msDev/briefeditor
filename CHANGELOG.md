# Changelog

## [1.2.1](https://github.com/ps-msDev/briefeditor/compare/v1.2.0...v1.2.1) (2026-07-12)


### Bug Fixes

* unify DIN 5008 layout between preview and PDF export via shared constants ([474771c](https://github.com/ps-msDev/briefeditor/commit/474771cadd0ffe189bea11d1779ef7512fd7dc23))
* show error toast when PDF export fails instead of silent print fallback ([f3b6ecf](https://github.com/ps-msDev/briefeditor/commit/f3b6ecfc679145ad5b86cbe81ca7c9bff7c5e336))
* remove duplicate recipientAddressSupplement key in clearAllText (build warning) ([8c38d2c](https://github.com/ps-msDev/briefeditor/commit/8c38d2c0c67481e0ea650080eca9a10c46e23f0e))


### Miscellaneous

* **deps:** remove unused dependencies (@base44/sdk, framer-motion, sharp, to-ico) and leftover scaffolding ([0b0479c](https://github.com/ps-msDev/briefeditor/commit/0b0479c4b2c12401d36f0e1330c368386d2bd910))
* **deps:** update dependencies within semver ranges to fix all npm audit vulnerabilities ([5a16f42](https://github.com/ps-msDev/briefeditor/commit/5a16f42745d0a77dc5e0a7e771f2c3415f8b65fe))
* remove dead code (unused shadcn/ui components, printAsPDF, A4Canvas, ZoomTestHelper) ([87c0c94](https://github.com/ps-msDev/briefeditor/commit/87c0c945fec09ef911a5f87510270c842e6ed52f))
* fix all eslint findings (unused imports, invalid props, unwired analytics handler) ([3da7479](https://github.com/ps-msDev/briefeditor/commit/3da7479946b0c008a7a196a10f10525f3c6eb628))


### Tests

* add Vitest with unit tests for DIN 5008 constants, letter text helpers and PDF export ([fdd0169](https://github.com/ps-msDev/briefeditor/commit/fdd0169541a4c640d5f10162f08cd4bc1750ab4e))

## [1.2.0](https://github.com/ps-msDev/briefeditor/compare/v1.1.0...v1.2.0) (2025-10-26)


### Features

* Add recipient address supplement functionality across components ([4a91120](https://github.com/ps-msDev/briefeditor/commit/4a911208b9e2ef3ee4e7090669b84685539259a2))
* Enhance LetterPreview and PDF export with new font size and separator line ([4f614c5](https://github.com/ps-msDev/briefeditor/commit/4f614c50cd9627f3091e5c6c853e5c6e914046b9))


### Bug Fixes

* Adjust layout in LetterPreview component for improved spacing ([3e0f52c](https://github.com/ps-msDev/briefeditor/commit/3e0f52c16daf8a61f075e074e54c10248e8e019a))
* Refine character limit warning logic in LetterForm component ([d2d3755](https://github.com/ps-msDev/briefeditor/commit/d2d3755b6b21f193be3e2f44e873faac3866b88d))
* Update translations for recipient address supplement in German ([0fcc1f9](https://github.com/ps-msDev/briefeditor/commit/0fcc1f9905c905792f7f6dc5e09d9b2a81d40cf7))

## [1.1.0](https://github.com/ps-msDev/briefeditor/compare/v1.0.0...v1.1.0) (2025-10-26)


### Features

* Implement character limits and counters in LetterForm fields ([c8417ee](https://github.com/ps-msDev/briefeditor/commit/c8417eed292e58257b83edd684a87d8a6ab4bba7))


### Bug Fixes

* Update character limits and layout for LetterForm and LetterPreview components ([e8a0a54](https://github.com/ps-msDev/briefeditor/commit/e8a0a54d82fb0fd06f3de4b54396c360cea593d6))

## 1.0.0 (2025-10-26)


### Features

* Add application version display in LetterWriter ([783caf8](https://github.com/ps-msDev/briefeditor/commit/783caf851d204089ea29c5855d6017f1c7c9928e))
* Add main text field and update layout in A4Canvas and LetterPreview ([3dcf5e6](https://github.com/ps-msDev/briefeditor/commit/3dcf5e6f104aa461b51fd903c7e4270894e8015a))
* Add PDF filename input and translations for export functionality ([46ac6eb](https://github.com/ps-msDev/briefeditor/commit/46ac6ebb09986e583396708970ded32000decf40))
* Add test text buttons and improve print functionality ([f89a124](https://github.com/ps-msDev/briefeditor/commit/f89a1247c1ed1de5a7b410f3719f552780148ec2))
* Enhance DIN 5008 Info Dialog and translations ([a4333d5](https://github.com/ps-msDev/briefeditor/commit/a4333d5f15593027aade12d58dc5b00cea26761a))
* Enhance PDF export with footer and legal information support ([a2eb5ff](https://github.com/ps-msDev/briefeditor/commit/a2eb5ff15c50ff326a66d23be8031629769462f9))
* Improve PDF export layout with enhanced body, closing, and signature spacing ([f67b6c4](https://github.com/ps-msDev/briefeditor/commit/f67b6c4ba1efb6badec76b5993f6a3923c5f3e41))
* Update LetterPreview layout for improved closing and signature display ([2b5625f](https://github.com/ps-msDev/briefeditor/commit/2b5625fca65a6640927547a1427fe4a12c860051))


### Bug Fixes

* Update PDF filename handling and translations ([e079056](https://github.com/ps-msDev/briefeditor/commit/e0790568b590e4bbe84d630d78ea9ee26f241474))
