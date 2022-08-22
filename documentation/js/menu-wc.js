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
                    <a href="index.html" data-type="index-link">reasoner documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
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
                                <span class="icon ion-ios-paper"></span>README
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
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link" >AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' : 'data-target="#xs-controllers-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' :
                                            'id="xs-controllers-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' : 'data-target="#xs-injectables-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' :
                                        'id="xs-injectables-links-module-AppModule-b62efca4510d9b6b027a62146255c4ee1ad338dbf1ac39a86e4ffbe6b3da5e8a4d9ff365ee3f197ee790cf2a733b83457207d8e46e560ab13e26de1bdc2f0f0e"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SendgridService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendgridService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link" >AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' : 'data-target="#xs-controllers-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' :
                                            'id="xs-controllers-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' : 'data-target="#xs-injectables-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' :
                                        'id="xs-injectables-links-module-AuthModule-0a2e1a4e24f6a7088f738c4f711095c74c1c6eb2b46e4a83446308fb89e6204d6503367b34dc068bad94eb5864f14ff8e6dcfbd4a0eaf848343668aed58c0582"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategyRefreshToken.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategyRefreshToken</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategyResetPassword.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategyResetPassword</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SendgridModule.html" data-type="entity-link" >SendgridModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SendgridModule-d6bbabd93a20bb58f1bbe35198d95d3929a9fdfee0246ff3806d0735d8493c70924acbf0deb5b3633de5fd315aa4f2646d976313ef31404408c7ef56fcdaf958"' : 'data-target="#xs-injectables-links-module-SendgridModule-d6bbabd93a20bb58f1bbe35198d95d3929a9fdfee0246ff3806d0735d8493c70924acbf0deb5b3633de5fd315aa4f2646d976313ef31404408c7ef56fcdaf958"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SendgridModule-d6bbabd93a20bb58f1bbe35198d95d3929a9fdfee0246ff3806d0735d8493c70924acbf0deb5b3633de5fd315aa4f2646d976313ef31404408c7ef56fcdaf958"' :
                                        'id="xs-injectables-links-module-SendgridModule-d6bbabd93a20bb58f1bbe35198d95d3929a9fdfee0246ff3806d0735d8493c70924acbf0deb5b3633de5fd315aa4f2646d976313ef31404408c7ef56fcdaf958"' }>
                                        <li class="link">
                                            <a href="injectables/SendgridService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >SendgridService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link" >UserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-aac7b97e0fa8f36c485ca3f6c33265b5d77fcb8220625e2d3adf9f5406f89aa1eb3e34926c156576fd272fd816a758fbdc8befc33eeeebce1a018fc686f4737f"' : 'data-target="#xs-injectables-links-module-UserModule-aac7b97e0fa8f36c485ca3f6c33265b5d77fcb8220625e2d3adf9f5406f89aa1eb3e34926c156576fd272fd816a758fbdc8befc33eeeebce1a018fc686f4737f"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-aac7b97e0fa8f36c485ca3f6c33265b5d77fcb8220625e2d3adf9f5406f89aa1eb3e34926c156576fd272fd816a758fbdc8befc33eeeebce1a018fc686f4737f"' :
                                        'id="xs-injectables-links-module-UserModule-aac7b97e0fa8f36c485ca3f6c33265b5d77fcb8220625e2d3adf9f5406f89aa1eb3e34926c156576fd272fd816a758fbdc8befc33eeeebce1a018fc686f4737f"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#entities-links"' :
                                'data-target="#xs-entities-links"' }>
                                <span class="icon ion-ios-apps"></span>
                                <span>Entities</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="entities-links"' : 'id="xs-entities-links"' }>
                                <li class="link">
                                    <a href="entities/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                                </li>
                                <li class="link">
                                    <a href="entities/User.html" data-type="entity-link" >User</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsValidPassword.html" data-type="entity-link" >IsValidPassword</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokensRepository.html" data-type="entity-link" >RefreshTokensRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersRepository.html" data-type="entity-link" >UsersRepository</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link" >JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link" >LocalAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidationPipe.html" data-type="entity-link" >ValidationPipe</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});