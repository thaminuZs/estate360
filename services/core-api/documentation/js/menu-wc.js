'use strict';

customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">Estate 360 - Core API Documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search">
    <input type="text" placeholder="Type to search">
    <button type="button"
        class="search-input-clear"
        aria-label="Clear search"
        data-search-input-clear>&times;</button>
</div>
` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                                <li class="link">
                                    <a href="overview.html" data-type="chapter-link">
                                        <span class="icon ion-ios-keypad"></span>Overview
                                    </a>
                                </li>

                            <li class="link">
                                <a href="index.html" data-type="chapter-link">
                                    <span class="icon ion-ios-paper"></span>
                                        README
                                </a>
                            </li>
                                <li class="link">
                                    <a href="architecture.html" data-type="chapter-link">
                                        <span class="icon ion-ios-git-branch"></span>Architecture
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                                <li class="link">
                                    <a href="properties.html" data-type="chapter-link">
                                        <span class="icon ion-ios-apps"></span>Properties
                                    </a>
                                </li>

                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-bs-toggle="collapse" ${ isNormalMode ?
                                'data-bs-target="#modules-links"' : 'data-bs-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' : 'data-bs-target="#xs-controllers-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' :
                                            'id="xs-controllers-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' : 'data-bs-target="#xs-injectables-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' :
                                        'id="xs-injectables-links-module-AppModule-6c970b5ad764b9517a8759a4314b4112a4b1d3403d2934b0ccd62e2863c1b875cce4e37d3bc562dad2300763dc223a866ff33903cf6fc83b0893ba720a07acf5"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AssignmentsModule.html" data-type="entity-link" >AssignmentsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' : 'data-bs-target="#xs-controllers-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' :
                                            'id="xs-controllers-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' }>
                                            <li class="link">
                                                <a href="controllers/AssignmentsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AssignmentsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' : 'data-bs-target="#xs-injectables-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' :
                                        'id="xs-injectables-links-module-AssignmentsModule-2864068e7cea9ff35f4d5c3741d1eb64517b188ae8b7acdb7d090946853a0a8cf4b553f48d1e2646619cc32dcb37220006414a72bd964405971646d6b6b40445"' }>
                                        <li class="link">
                                            <a href="injectables/EstateAssignmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EstateAssignmentService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/WorkerAssignmentService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkerAssignmentService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AttendanceModule.html" data-type="entity-link" >AttendanceModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' : 'data-bs-target="#xs-controllers-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' :
                                            'id="xs-controllers-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' }>
                                            <li class="link">
                                                <a href="controllers/AttendanceController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttendanceController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' : 'data-bs-target="#xs-injectables-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' :
                                        'id="xs-injectables-links-module-AttendanceModule-386b187376574ad662eac8c38978d3314936d614a2099517ec174302c2059d75c342ff8ed542296973f2ac8172637f55d58bb6a091224add2758b324e9904ef9"' }>
                                        <li class="link">
                                            <a href="injectables/AttendanceService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AttendanceService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' : 'data-bs-target="#xs-controllers-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' :
                                            'id="xs-controllers-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' : 'data-bs-target="#xs-injectables-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' :
                                        'id="xs-injectables-links-module-AuthModule-ed3688abdba0fb5bf360c9e641437d42ee230ea8c35390f538480b9b83764139fdeede90bb4cc57d39a49a333f68b7b76fbdcdcb312364e10ec076ba69ee30d4"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/BcryptService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >BcryptService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CropModule.html" data-type="entity-link" >CropModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' : 'data-bs-target="#xs-controllers-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' :
                                            'id="xs-controllers-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' }>
                                            <li class="link">
                                                <a href="controllers/CropsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CropsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' : 'data-bs-target="#xs-injectables-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' :
                                        'id="xs-injectables-links-module-CropModule-508d41536081065d49770a1de62823818128236db1674561ae3a171f08532b7c544d99b64c31a85ebf95fe2f42bfd09011163a7442a4317184cb05ed82228a5d"' }>
                                        <li class="link">
                                            <a href="injectables/CropsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >CropsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EmployeesModule.html" data-type="entity-link" >EmployeesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' : 'data-bs-target="#xs-controllers-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' :
                                            'id="xs-controllers-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' }>
                                            <li class="link">
                                                <a href="controllers/EmployeesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' : 'data-bs-target="#xs-injectables-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' :
                                        'id="xs-injectables-links-module-EmployeesModule-5a29675c5fb3d97efd0d2956c3152c7595df9e5e0f979cadd1854218b89edde612dbe88396b4e5a5a7c0f105658035cbe43164b633b44fa96df0d86467cde162"' }>
                                        <li class="link">
                                            <a href="injectables/EmployeesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EmployeesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/EstatesModule.html" data-type="entity-link" >EstatesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' : 'data-bs-target="#xs-controllers-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' :
                                            'id="xs-controllers-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' }>
                                            <li class="link">
                                                <a href="controllers/EstatesController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EstatesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' : 'data-bs-target="#xs-injectables-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' :
                                        'id="xs-injectables-links-module-EstatesModule-d35b9b5d5338b35a3b000e4f06e6b9f2c7cc3f24f309117a85b8198d7914d71a5ff9116660c2446f6e9febe4741c3072d69a0de52ae32ea87a71ad992ab8e99e"' }>
                                        <li class="link">
                                            <a href="injectables/EstatesService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >EstatesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/IotModule.html" data-type="entity-link" >IotModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' : 'data-bs-target="#xs-controllers-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' :
                                            'id="xs-controllers-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' }>
                                            <li class="link">
                                                <a href="controllers/IotController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IotController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' : 'data-bs-target="#xs-injectables-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' :
                                        'id="xs-injectables-links-module-IotModule-83083a28b6be851505603ee94389f25912572ffc1fde79a1cfeaa87da8865e89e38a4bbdec26ac14594f646c44e708e0bd0fcb9d487ceb4d703a5cade2a3cf75"' }>
                                        <li class="link">
                                            <a href="injectables/IotCloudFetchService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IotCloudFetchService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/IotService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >IotService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/OwnersModule.html" data-type="entity-link" >OwnersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' : 'data-bs-target="#xs-controllers-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' :
                                            'id="xs-controllers-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' }>
                                            <li class="link">
                                                <a href="controllers/OwnersController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OwnersController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' : 'data-bs-target="#xs-injectables-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' :
                                        'id="xs-injectables-links-module-OwnersModule-f83a56ffb4f81543ba37f91e9a59520f06920d0c1e45bfe679878fc83ab9b19e7154020ada3862e89c3ff41dd92ad2c56585dba908b020c356242265bbb8049e"' }>
                                        <li class="link">
                                            <a href="injectables/OwnersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >OwnersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PaymentDetailsModule.html" data-type="entity-link" >PaymentDetailsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' : 'data-bs-target="#xs-controllers-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' :
                                            'id="xs-controllers-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' }>
                                            <li class="link">
                                                <a href="controllers/PaymentDetailsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentDetailsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' : 'data-bs-target="#xs-injectables-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' :
                                        'id="xs-injectables-links-module-PaymentDetailsModule-b090d86c609eb982f2b4f554c8c457aed98ab5556e35232748881a0b3de20a51bb671cf13bed76470454985ca03ad84729d0661ac175fb26c732c9eb1b039088"' }>
                                        <li class="link">
                                            <a href="injectables/PaymentDetailsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PaymentDetailsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/PayrollModule.html" data-type="entity-link" >PayrollModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' : 'data-bs-target="#xs-controllers-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' :
                                            'id="xs-controllers-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' }>
                                            <li class="link">
                                                <a href="controllers/PayrollController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayrollController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' : 'data-bs-target="#xs-injectables-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' :
                                        'id="xs-injectables-links-module-PayrollModule-80d4de7e2ee0a4b45e8cac88aad31584d488c976a1329f3d1aa923c193be361b7ea8fd7a962660dd745756670310effa14acf6f2dc30505c134a001be6ff0b3d"' }>
                                        <li class="link">
                                            <a href="injectables/PayrollService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >PayrollService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProductionModule.html" data-type="entity-link" >ProductionModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' : 'data-bs-target="#xs-controllers-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' :
                                            'id="xs-controllers-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' }>
                                            <li class="link">
                                                <a href="controllers/ProductionController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductionController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' : 'data-bs-target="#xs-injectables-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' :
                                        'id="xs-injectables-links-module-ProductionModule-6fe3d31088fc717c08b3da7f11498d52d549fa23e10634a738f7c05535aa6bce1bbd171a82fafc3c46ad9eec7709a045c4e312b0cad049f11b55cd8bb2e8ea53"' }>
                                        <li class="link">
                                            <a href="injectables/ProductionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProductionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/WorkSessionsModule.html" data-type="entity-link" >WorkSessionsModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                            'data-bs-target="#controllers-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' : 'data-bs-target="#xs-controllers-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' :
                                            'id="xs-controllers-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' }>
                                            <li class="link">
                                                <a href="controllers/WorkSessionsController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkSessionsController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ?
                                        'data-bs-target="#injectables-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' : 'data-bs-target="#xs-injectables-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' :
                                        'id="xs-injectables-links-module-WorkSessionsModule-fd68a6d9d6fab6c23b052dffe79ee46285efc4060fc02afc35913a9e0f4435f72a86c5305ec36db395c15f13152f83060858755534c96e37b144e95372fc3d10"' }>
                                        <li class="link">
                                            <a href="injectables/WorkSessionsService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >WorkSessionsService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#controllers-links"' :
                                'data-bs-target="#xs-controllers-links"' }>
                                <span class="icon ion-md-swap"></span>
                                <span>Controllers</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="controllers-links"' : 'id="xs-controllers-links"' }>
                                <li class="link">
                                    <a href="controllers/AppController.html" data-type="entity-link" >AppController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AssignmentsController.html" data-type="entity-link" >AssignmentsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AttendanceController.html" data-type="entity-link" >AttendanceController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/AuthController.html" data-type="entity-link" >AuthController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/CropsController.html" data-type="entity-link" >CropsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EmployeesController.html" data-type="entity-link" >EmployeesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/EstatesController.html" data-type="entity-link" >EstatesController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/IotController.html" data-type="entity-link" >IotController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/OwnersController.html" data-type="entity-link" >OwnersController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PaymentDetailsController.html" data-type="entity-link" >PaymentDetailsController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/PayrollController.html" data-type="entity-link" >PayrollController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/ProductionController.html" data-type="entity-link" >ProductionController</a>
                                </li>
                                <li class="link">
                                    <a href="controllers/WorkSessionsController.html" data-type="entity-link" >WorkSessionsController</a>
                                </li>
                            </ul>
                        </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#entities-links"' :
                                'data-bs-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/Attendance.html" data-type="entity-link" >Attendance</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Crop.html" data-type="entity-link" >Crop</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Device.html" data-type="entity-link" >Device</a>
                                </li>
                                <li class="link">
                                    <a href="entities/DeviceAssignment.html" data-type="entity-link" >DeviceAssignment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Employee.html" data-type="entity-link" >Employee</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EmployeePaymentDetail.html" data-type="entity-link" >EmployeePaymentDetail</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EnvironmentIotReading.html" data-type="entity-link" >EnvironmentIotReading</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Estate.html" data-type="entity-link" >Estate</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EstateAssignment.html" data-type="entity-link" >EstateAssignment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/EstatePayRate.html" data-type="entity-link" >EstatePayRate</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Owner.html" data-type="entity-link" >Owner</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Payment.html" data-type="entity-link" >Payment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Payroll.html" data-type="entity-link" >Payroll</a>
                                </li>
                                <li class="link">
                                    <a href="entities/PayrollItem.html" data-type="entity-link" >PayrollItem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/ProductionRecord.html" data-type="entity-link" >ProductionRecord</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                                <li class="link">
                                    <a href="entities/WorkerAssignment.html" data-type="entity-link" >WorkerAssignment</a>
                                </li>
                                <li class="link">
                                    <a href="entities/WorkerIotReading.html" data-type="entity-link" >WorkerIotReading</a>
                                </li>
                                <li class="link">
                                    <a href="entities/WorkSession.html" data-type="entity-link" >WorkSession</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#classes-links"' :
                            'data-bs-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CheckInAttendanceDto.html" data-type="entity-link" >CheckInAttendanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CheckOutAttendanceDto.html" data-type="entity-link" >CheckOutAttendanceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigureIotCloudDto.html" data-type="entity-link" >ConfigureIotCloudDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCropDto.html" data-type="entity-link" >CreateCropDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDeviceAssignmentDto.html" data-type="entity-link" >CreateDeviceAssignmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateDeviceDto.html" data-type="entity-link" >CreateDeviceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEmployeeDto.html" data-type="entity-link" >CreateEmployeeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEnvironmentReadingDto.html" data-type="entity-link" >CreateEnvironmentReadingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEstateAssignmentDto.html" data-type="entity-link" >CreateEstateAssignmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateEstateDto.html" data-type="entity-link" >CreateEstateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateOwnerDto.html" data-type="entity-link" >CreateOwnerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentDetailDto.html" data-type="entity-link" >CreatePaymentDetailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePaymentDto.html" data-type="entity-link" >CreatePaymentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreatePayRateDto.html" data-type="entity-link" >CreatePayRateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateProductionRecordDto.html" data-type="entity-link" >CreateProductionRecordDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorkerAssignmentDto.html" data-type="entity-link" >CreateWorkerAssignmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorkerReadingDto.html" data-type="entity-link" >CreateWorkerReadingDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateWorkSessionDto.html" data-type="entity-link" >CreateWorkSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/EndWorkSessionDto.html" data-type="entity-link" >EndWorkSessionDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeneratePayrollDto.html" data-type="entity-link" >GeneratePayrollDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GeoPointDto.html" data-type="entity-link" >GeoPointDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginDto.html" data-type="entity-link" >LoginDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchEmployeeDto.html" data-type="entity-link" >PatchEmployeeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PatchOwnerDto.html" data-type="entity-link" >PatchOwnerDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PointDto.html" data-type="entity-link" >PointDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PolygonDto.html" data-type="entity-link" >PolygonDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokenDto.html" data-type="entity-link" >RefreshTokenDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterDto.html" data-type="entity-link" >RegisterDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateCropDto.html" data-type="entity-link" >UpdateCropDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEstateAssignmentDto.html" data-type="entity-link" >UpdateEstateAssignmentDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateEstateDto.html" data-type="entity-link" >UpdateEstateDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdatePaymentDetailDto.html" data-type="entity-link" >UpdatePaymentDetailDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateWorkerAssignmentDto.html" data-type="entity-link" >UpdateWorkerAssignmentDto</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#injectables-links"' :
                                'data-bs-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AppService.html" data-type="entity-link" >AppService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AttendanceService.html" data-type="entity-link" >AttendanceService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AuthService.html" data-type="entity-link" >AuthService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/BcryptService.html" data-type="entity-link" >BcryptService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CropsService.html" data-type="entity-link" >CropsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EmployeesService.html" data-type="entity-link" >EmployeesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EstateAssignmentService.html" data-type="entity-link" >EstateAssignmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EstatesService.html" data-type="entity-link" >EstatesService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IotCloudFetchService.html" data-type="entity-link" >IotCloudFetchService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/IotService.html" data-type="entity-link" >IotService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/OwnersService.html" data-type="entity-link" >OwnersService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PaymentDetailsService.html" data-type="entity-link" >PaymentDetailsService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/PayrollService.html" data-type="entity-link" >PayrollService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProductionService.html" data-type="entity-link" >ProductionService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkerAssignmentService.html" data-type="entity-link" >WorkerAssignmentService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/WorkSessionsService.html" data-type="entity-link" >WorkSessionsService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#guards-links"' :
                            'data-bs-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link" >AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link" >RolesGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#interfaces-links"' :
                            'data-bs-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ActiveUserData.html" data-type="entity-link" >ActiveUserData</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CloudEnvReadingPayload.html" data-type="entity-link" >CloudEnvReadingPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CloudWorkerReadingPayload.html" data-type="entity-link" >CloudWorkerReadingPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/RequestWithUser-1.html" data-type="entity-link" >RequestWithUser</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-bs-toggle="collapse" ${ isNormalMode ? 'data-bs-target="#miscellaneous-links"'
                            : 'data-bs-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <a data-type="chapter-link" href="routes.html"><span class="icon ion-ios-git-branch"></span>Routes</a>
                        </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank" rel="noopener noreferrer">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
