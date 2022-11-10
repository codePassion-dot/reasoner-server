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
                                            'data-target="#controllers-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' : 'data-target="#xs-controllers-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' :
                                            'id="xs-controllers-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' : 'data-target="#xs-injectables-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' :
                                        'id="xs-injectables-links-module-AppModule-989ecb1756ba5bc70c69cd31145fd2db286c82c4b38e9ed400369709a869cc6cdae85689b42e1c46b6111d5fe21a9befd1d10a332c66610a56f76e24219c8443"' }>
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
                                            'data-target="#controllers-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' : 'data-target="#xs-controllers-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' :
                                            'id="xs-controllers-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' : 'data-target="#xs-injectables-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' :
                                        'id="xs-injectables-links-module-AuthModule-91a13c188d9a36ef6fe22aae5e42894a20b2049bd68c2d5d0898648195ecfda1819fe1ba45b62813ce3250e5f6147c6e32d7d0250fa3b9d03dc2d2a843d0db35"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >JwtStrategy</a>
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
                                <a href="modules/ConnectionModule.html" data-type="entity-link" >ConnectionModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ConnectionModule-10df053bea9fd79c7c9d1f6d7212875f2890bac51a58b40cac1c542280200633a2c41d1a2e9b69a2e904e1d9a851c92f5a434e7407a5902420f8b84751c188dc"' : 'data-target="#xs-injectables-links-module-ConnectionModule-10df053bea9fd79c7c9d1f6d7212875f2890bac51a58b40cac1c542280200633a2c41d1a2e9b69a2e904e1d9a851c92f5a434e7407a5902420f8b84751c188dc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ConnectionModule-10df053bea9fd79c7c9d1f6d7212875f2890bac51a58b40cac1c542280200633a2c41d1a2e9b69a2e904e1d9a851c92f5a434e7407a5902420f8b84751c188dc"' :
                                        'id="xs-injectables-links-module-ConnectionModule-10df053bea9fd79c7c9d1f6d7212875f2890bac51a58b40cac1c542280200633a2c41d1a2e9b69a2e904e1d9a851c92f5a434e7407a5902420f8b84751c188dc"' }>
                                        <li class="link">
                                            <a href="injectables/ConnectionService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ConnectionService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DatabaseModule.html" data-type="entity-link" >DatabaseModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-DatabaseModule-4df168623bc0d5842f5825843235c9d362eebaf05e9291533586e3364129f76b5a4efd608ac8c93ff06a06e7f8dce8a8d6775674c1162af2cf51db52b00225e7"' : 'data-target="#xs-injectables-links-module-DatabaseModule-4df168623bc0d5842f5825843235c9d362eebaf05e9291533586e3364129f76b5a4efd608ac8c93ff06a06e7f8dce8a8d6775674c1162af2cf51db52b00225e7"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-DatabaseModule-4df168623bc0d5842f5825843235c9d362eebaf05e9291533586e3364129f76b5a4efd608ac8c93ff06a06e7f8dce8a8d6775674c1162af2cf51db52b00225e7"' :
                                        'id="xs-injectables-links-module-DatabaseModule-4df168623bc0d5842f5825843235c9d362eebaf05e9291533586e3364129f76b5a4efd608ac8c93ff06a06e7f8dce8a8d6775674c1162af2cf51db52b00225e7"' }>
                                        <li class="link">
                                            <a href="injectables/DatabaseService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >DatabaseService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ParameterizerModule.html" data-type="entity-link" >ParameterizerModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' : 'data-target="#xs-controllers-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' :
                                            'id="xs-controllers-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' }>
                                            <li class="link">
                                                <a href="controllers/ParameterizerController.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParameterizerController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' : 'data-target="#xs-injectables-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' :
                                        'id="xs-injectables-links-module-ParameterizerModule-3b535c746f7c5335fc024ee5c134a739cccbabc7b36192ac1eb839ef4232c03398866268531a5e6197e1106036414b6f014aee1d9f9da1f5ba02433c48e622bc"' }>
                                        <li class="link">
                                            <a href="injectables/ParameterizerService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ParameterizerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProblemModule.html" data-type="entity-link" >ProblemModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProblemModule-1a816b168c8e3b12e7bc74f4799724714f2bf12c6f1d6e7ccd143acadb9661bb17ca4bdad82450a8dc7740393bd7cc8111af089336d2ec49fcc29329b03f21ff"' : 'data-target="#xs-injectables-links-module-ProblemModule-1a816b168c8e3b12e7bc74f4799724714f2bf12c6f1d6e7ccd143acadb9661bb17ca4bdad82450a8dc7740393bd7cc8111af089336d2ec49fcc29329b03f21ff"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProblemModule-1a816b168c8e3b12e7bc74f4799724714f2bf12c6f1d6e7ccd143acadb9661bb17ca4bdad82450a8dc7740393bd7cc8111af089336d2ec49fcc29329b03f21ff"' :
                                        'id="xs-injectables-links-module-ProblemModule-1a816b168c8e3b12e7bc74f4799724714f2bf12c6f1d6e7ccd143acadb9661bb17ca4bdad82450a8dc7740393bd7cc8111af089336d2ec49fcc29329b03f21ff"' }>
                                        <li class="link">
                                            <a href="injectables/ProblemService.html" data-type="entity-link" data-context="sub-entity" data-context-id="modules" >ProblemService</a>
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
                                    <a href="entities/Algorithm.html" data-type="entity-link" >Algorithm</a>
                                </li>
                                <li class="link">
                                    <a href="entities/BaseCaseColumn.html" data-type="entity-link" >BaseCaseColumn</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Connection.html" data-type="entity-link" >Connection</a>
                                </li>
                                <li class="link">
                                    <a href="entities/MappedValue.html" data-type="entity-link" >MappedValue</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Problem.html" data-type="entity-link" >Problem</a>
                                </li>
                                <li class="link">
                                    <a href="entities/RefreshToken.html" data-type="entity-link" >RefreshToken</a>
                                </li>
                                <li class="link">
                                    <a href="entities/Registry.html" data-type="entity-link" >Registry</a>
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
                                <a href="classes/AlgorithmsRepository.html" data-type="entity-link" >AlgorithmsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseCaseColumns.html" data-type="entity-link" >BaseCaseColumns</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConnectionsRepository.html" data-type="entity-link" >ConnectionsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateConnectionOptionsDto.html" data-type="entity-link" >CreateConnectionOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link" >CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetProblemSourceTablesDto.html" data-type="entity-link" >GetProblemSourceTablesDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/IsValidPassword.html" data-type="entity-link" >IsValidPassword</a>
                            </li>
                            <li class="link">
                                <a href="classes/MappedValuesRepository.html" data-type="entity-link" >MappedValuesRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProblemsRepository.html" data-type="entity-link" >ProblemsRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/RefreshTokensRepository.html" data-type="entity-link" >RefreshTokensRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveNewRegistrySelectedColumnsDto.html" data-type="entity-link" >SaveNewRegistrySelectedColumnsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveProblemAlgorithmDto.html" data-type="entity-link" >SaveProblemAlgorithmDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveProblemSourceColumnsDto.html" data-type="entity-link" >SaveProblemSourceColumnsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveProblemSourceColumnsTypeDto.html" data-type="entity-link" >SaveProblemSourceColumnsTypeDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveProblemSourceDto.html" data-type="entity-link" >SaveProblemSourceDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/SaveProblemSourceSelectedOrdinalColumns.html" data-type="entity-link" >SaveProblemSourceSelectedOrdinalColumns</a>
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
                                    <a href="injectables/JwtBaseAuthGuard.html" data-type="entity-link" >JwtBaseAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtRefreshAuthGuard.html" data-type="entity-link" >JwtRefreshAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtResetAuthGuard.html" data-type="entity-link" >JwtResetAuthGuard</a>
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
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/ConnectionOptions.html" data-type="entity-link" >ConnectionOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateNewConnectionResponse.html" data-type="entity-link" >CreateNewConnectionResponse</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/CreateNewConnectionResponseWithError.html" data-type="entity-link" >CreateNewConnectionResponseWithError</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DatabaseInstance.html" data-type="entity-link" >DatabaseInstance</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/NewRegistry.html" data-type="entity-link" >NewRegistry</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemSource.html" data-type="entity-link" >ProblemSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemSourceColumn.html" data-type="entity-link" >ProblemSourceColumn</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemSourceMappedColumns.html" data-type="entity-link" >ProblemSourceMappedColumns</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemSourceSchema.html" data-type="entity-link" >ProblemSourceSchema</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProblemSourceTable.html" data-type="entity-link" >ProblemSourceTable</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ProbleSourceSelectedColumnsNewProblem.html" data-type="entity-link" >ProbleSourceSelectedColumnsNewProblem</a>
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