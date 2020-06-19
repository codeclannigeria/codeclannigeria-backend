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
                    <a href="index.html" data-type="index-link">code_clan_nigeria documentation</a>
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
                            <a href="license.html"  data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>LICENSE
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
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
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' : 'data-target="#xs-controllers-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' :
                                            'id="xs-controllers-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' : 'data-target="#xs-injectables-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' :
                                        'id="xs-injectables-links-module-AppModule-aca24346fe6df16d9ed28b28bd6bda0b"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' : 'data-target="#xs-controllers-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' :
                                            'id="xs-controllers-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' : 'data-target="#xs-injectables-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' :
                                        'id="xs-injectables-links-module-AuthModule-7b35b72d73872f3a848448e540adb045"' }>
                                        <li class="link">
                                            <a href="injectables/AuthHandler.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthHandler</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/MailService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/SessionSerializer.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>SessionSerializer</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/TempTokensService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TempTokensService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CategoriesModule.html" data-type="entity-link">CategoriesModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' : 'data-target="#xs-controllers-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' :
                                            'id="xs-controllers-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' }>
                                            <li class="link">
                                                <a href="controllers/CategoriesController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">CategoriesController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' : 'data-target="#xs-injectables-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' :
                                        'id="xs-injectables-links-module-CategoriesModule-5f103be9e7b76d608a8710900b158cbb"' }>
                                        <li class="link">
                                            <a href="injectables/CategoryService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CategoryService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/DbTest.html" data-type="entity-link">DbTest</a>
                            </li>
                            <li class="link">
                                <a href="modules/MailModule.html" data-type="entity-link">MailModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-MailModule-4c757291f1f99c33ca78e5498b323842"' : 'data-target="#xs-injectables-links-module-MailModule-4c757291f1f99c33ca78e5498b323842"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-MailModule-4c757291f1f99c33ca78e5498b323842"' :
                                        'id="xs-injectables-links-module-MailModule-4c757291f1f99c33ca78e5498b323842"' }>
                                        <li class="link">
                                            <a href="injectables/MailService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>MailService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProfileModule.html" data-type="entity-link">ProfileModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' : 'data-target="#xs-controllers-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' :
                                            'id="xs-controllers-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' : 'data-target="#xs-injectables-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' :
                                        'id="xs-injectables-links-module-ProfileModule-1648cbb43a2f46f03536c3552ee1c41d"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProfileService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-SharedModule-e4c719fb507af39b8157eee714c1da53"' : 'data-target="#xs-injectables-links-module-SharedModule-e4c719fb507af39b8157eee714c1da53"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-SharedModule-e4c719fb507af39b8157eee714c1da53"' :
                                        'id="xs-injectables-links-module-SharedModule-e4c719fb507af39b8157eee714c1da53"' }>
                                        <li class="link">
                                            <a href="injectables/CurrentUserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CurrentUserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TracksModule.html" data-type="entity-link">TracksModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-TracksModule-f7eb20e9d04dc95a31291869c595b89b"' : 'data-target="#xs-controllers-links-module-TracksModule-f7eb20e9d04dc95a31291869c595b89b"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-TracksModule-f7eb20e9d04dc95a31291869c595b89b"' :
                                            'id="xs-controllers-links-module-TracksModule-f7eb20e9d04dc95a31291869c595b89b"' }>
                                            <li class="link">
                                                <a href="controllers/TracksController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">TracksController</a>
                                            </li>
                                        </ul>
                                    </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-UsersModule-0e54a776768c31dba67aa6d51a26d176"' : 'data-target="#xs-controllers-links-module-UsersModule-0e54a776768c31dba67aa6d51a26d176"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-UsersModule-0e54a776768c31dba67aa6d51a26d176"' :
                                            'id="xs-controllers-links-module-UsersModule-0e54a776768c31dba67aa6d51a26d176"' }>
                                            <li class="link">
                                                <a href="controllers/UsersController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">UsersController</a>
                                            </li>
                                        </ul>
                                    </li>
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
                                <a href="classes/AbstractService.html" data-type="entity-link">AbstractService</a>
                            </li>
                            <li class="link">
                                <a href="classes/AbstractVm.html" data-type="entity-link">AbstractVm</a>
                            </li>
                            <li class="link">
                                <a href="classes/AcctVerifyDto.html" data-type="entity-link">AcctVerifyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiException.html" data-type="entity-link">ApiException</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link">BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseResDto.html" data-type="entity-link">BaseResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryDto.html" data-type="entity-link">CategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link">CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTrackDto.html" data-type="entity-link">CreateTrackDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link">CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link">HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginReqDto.html" data-type="entity-link">LoginReqDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/LoginResDto.html" data-type="entity-link">LoginResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedCategoryResDto.html" data-type="entity-link">PagedCategoryResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedReqDto.html" data-type="entity-link">PagedReqDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedTrackResDto.html" data-type="entity-link">PagedTrackResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedUserResDto.html" data-type="entity-link">PagedUserResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PasswordToken.html" data-type="entity-link">PasswordToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserDto.html" data-type="entity-link">RegisterUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/RegisterUserResDto.html" data-type="entity-link">RegisterUserResDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ResetPassInput.html" data-type="entity-link">ResetPassInput</a>
                            </li>
                            <li class="link">
                                <a href="classes/TemporaryToken.html" data-type="entity-link">TemporaryToken</a>
                            </li>
                            <li class="link">
                                <a href="classes/Track.html" data-type="entity-link">Track</a>
                            </li>
                            <li class="link">
                                <a href="classes/TrackDto.html" data-type="entity-link">TrackDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TracksService.html" data-type="entity-link">TracksService</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link">UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersService.html" data-type="entity-link">UsersService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidateTokenInput.html" data-type="entity-link">ValidateTokenInput</a>
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
                                    <a href="injectables/BaseService.html" data-type="entity-link">BaseService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CurrentUserService.html" data-type="entity-link">CurrentUserService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalAuthGuard.html" data-type="entity-link">LocalAuthGuard</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthenticationGuard.html" data-type="entity-link">AuthenticationGuard</a>
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
                                <a href="interfaces/AbstractControllerOptions.html" data-type="entity-link">AbstractControllerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AbstractControllerOptions-1.html" data-type="entity-link">AbstractControllerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AbstractControllerWithAuthOptions.html" data-type="entity-link">AbstractControllerWithAuthOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AbstractControllerWithSwaggerOptions.html" data-type="entity-link">AbstractControllerWithSwaggerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AbstractModel.html" data-type="entity-link">AbstractModel</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configuration.html" data-type="entity-link">Configuration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Database.html" data-type="entity-link">Database</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DefaultAuthObject.html" data-type="entity-link">DefaultAuthObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/JwtPayload.html" data-type="entity-link">JwtPayload</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Mailer.html" data-type="entity-link">Mailer</a>
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
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/typealiases.html" data-type="entity-link">Type aliases</a>
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