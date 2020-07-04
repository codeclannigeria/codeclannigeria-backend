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
                                            'data-target="#controllers-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' : 'data-target="#xs-controllers-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' :
                                            'id="xs-controllers-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' : 'data-target="#xs-injectables-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' :
                                        'id="xs-injectables-links-module-AppModule-34a93a2132e68690ac9d6c33bee91f96"' }>
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
                                            'data-target="#controllers-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' : 'data-target="#xs-controllers-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' :
                                            'id="xs-controllers-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' : 'data-target="#xs-injectables-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' :
                                        'id="xs-injectables-links-module-AuthModule-784f733505b6ec4c8faa2d157a2fc89a"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/JwtStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>JwtStrategy</a>
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
                            </li>
                            <li class="link">
                                <a href="modules/CoursesModule.html" data-type="entity-link">CoursesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoursesModule-633f9a0a9547b9467882e31abb185a04"' : 'data-target="#xs-injectables-links-module-CoursesModule-633f9a0a9547b9467882e31abb185a04"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoursesModule-633f9a0a9547b9467882e31abb185a04"' :
                                        'id="xs-injectables-links-module-CoursesModule-633f9a0a9547b9467882e31abb185a04"' }>
                                        <li class="link">
                                            <a href="injectables/CoursesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CoursesService</a>
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
                                            'data-target="#controllers-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' : 'data-target="#xs-controllers-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' :
                                            'id="xs-controllers-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' }>
                                            <li class="link">
                                                <a href="controllers/ProfileController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">ProfileController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' : 'data-target="#xs-injectables-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' :
                                        'id="xs-injectables-links-module-ProfileModule-c777b07add2d743904f99605d42c5cfb"' }>
                                        <li class="link">
                                            <a href="injectables/ProfileService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProfileService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/SharedModule.html" data-type="entity-link">SharedModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/StagesModule.html" data-type="entity-link">StagesModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-StagesModule-7f25ab73587efdd73408c185e5a50203"' : 'data-target="#xs-injectables-links-module-StagesModule-7f25ab73587efdd73408c185e5a50203"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-StagesModule-7f25ab73587efdd73408c185e5a50203"' :
                                        'id="xs-injectables-links-module-StagesModule-7f25ab73587efdd73408c185e5a50203"' }>
                                        <li class="link">
                                            <a href="injectables/StagesService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>StagesService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TasksModule.html" data-type="entity-link">TasksModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TasksModule-20a384b63f8ea1051137768226a8f10c"' : 'data-target="#xs-injectables-links-module-TasksModule-20a384b63f8ea1051137768226a8f10c"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TasksModule-20a384b63f8ea1051137768226a8f10c"' :
                                        'id="xs-injectables-links-module-TasksModule-20a384b63f8ea1051137768226a8f10c"' }>
                                        <li class="link">
                                            <a href="injectables/TasksService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TasksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/TracksModule.html" data-type="entity-link">TracksModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-TracksModule-f36a188f4db70818411549eefa98dfae"' : 'data-target="#xs-injectables-links-module-TracksModule-f36a188f4db70818411549eefa98dfae"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-TracksModule-f36a188f4db70818411549eefa98dfae"' :
                                        'id="xs-injectables-links-module-TracksModule-f36a188f4db70818411549eefa98dfae"' }>
                                        <li class="link">
                                            <a href="injectables/TracksService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>TracksService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UsersModule.html" data-type="entity-link">UsersModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UsersModule-151c03f279f2ebc5350a947696a5a045"' : 'data-target="#xs-injectables-links-module-UsersModule-151c03f279f2ebc5350a947696a5a045"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UsersModule-151c03f279f2ebc5350a947696a5a045"' :
                                        'id="xs-injectables-links-module-UsersModule-151c03f279f2ebc5350a947696a5a045"' }>
                                        <li class="link">
                                            <a href="injectables/UsersService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UsersService</a>
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
                                <a href="classes/AcctVerifyDto.html" data-type="entity-link">AcctVerifyDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ApiException.html" data-type="entity-link">ApiException</a>
                            </li>
                            <li class="link">
                                <a href="classes/AssignTasksDto.html" data-type="entity-link">AssignTasksDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AvatarUploadDto.html" data-type="entity-link">AvatarUploadDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseDto.html" data-type="entity-link">BaseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link">BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseService.html" data-type="entity-link">BaseService</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoriesController.html" data-type="entity-link">CategoriesController</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoriesService.html" data-type="entity-link">CategoriesService</a>
                            </li>
                            <li class="link">
                                <a href="classes/Category.html" data-type="entity-link">Category</a>
                            </li>
                            <li class="link">
                                <a href="classes/CategoryDto.html" data-type="entity-link">CategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Course.html" data-type="entity-link">Course</a>
                            </li>
                            <li class="link">
                                <a href="classes/CourseDto.html" data-type="entity-link">CourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CoursesController.html" data-type="entity-link">CoursesController</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCategoryDto.html" data-type="entity-link">CreateCategoryDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateCourseDto.html" data-type="entity-link">CreateCourseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateStageDto.html" data-type="entity-link">CreateStageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTaskDto.html" data-type="entity-link">CreateTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateTrackDto.html" data-type="entity-link">CreateTrackDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateUserDto.html" data-type="entity-link">CreateUserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/FindDto.html" data-type="entity-link">FindDto</a>
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
                                <a href="classes/PagedCategoryOutDto.html" data-type="entity-link">PagedCategoryOutDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedCourseOutputDto.html" data-type="entity-link">PagedCourseOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedListStageDto.html" data-type="entity-link">PagedListStageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedListTaskDto.html" data-type="entity-link">PagedListTaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedTrackOutputDto.html" data-type="entity-link">PagedTrackOutputDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PagedUserOutputDto.html" data-type="entity-link">PagedUserOutputDto</a>
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
                                <a href="classes/Stage.html" data-type="entity-link">Stage</a>
                            </li>
                            <li class="link">
                                <a href="classes/StageDto.html" data-type="entity-link">StageDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/StagesController.html" data-type="entity-link">StagesController</a>
                            </li>
                            <li class="link">
                                <a href="classes/Task.html" data-type="entity-link">Task</a>
                            </li>
                            <li class="link">
                                <a href="classes/TaskDto.html" data-type="entity-link">TaskDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/TasksController.html" data-type="entity-link">TasksController</a>
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
                                <a href="classes/TracksController.html" data-type="entity-link">TracksController</a>
                            </li>
                            <li class="link">
                                <a href="classes/UpdateProfileDto.html" data-type="entity-link">UpdateProfileDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/User.html" data-type="entity-link">User</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserDto.html" data-type="entity-link">UserDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/UsersController.html" data-type="entity-link">UsersController</a>
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
                                    <a href="injectables/JwtAuthGuard.html" data-type="entity-link">JwtAuthGuard</a>
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
                            <li class="link">
                                <a href="guards/RolesGuard.html" data-type="entity-link">RolesGuard</a>
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
                                <a href="interfaces/AbstractControllerWithAuthOptions.html" data-type="entity-link">AbstractControllerWithAuthOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AbstractControllerWithSwaggerOptions.html" data-type="entity-link">AbstractControllerWithSwaggerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/AuthObj.html" data-type="entity-link">AuthObj</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseControllerOptions.html" data-type="entity-link">BaseControllerOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseControllerWithAuthOptions.html" data-type="entity-link">BaseControllerWithAuthOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/BaseControllerWithSwaggerOpts.html" data-type="entity-link">BaseControllerWithSwaggerOpts</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Cloudinary.html" data-type="entity-link">Cloudinary</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Configuration.html" data-type="entity-link">Configuration</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ControllerAuth.html" data-type="entity-link">ControllerAuth</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Database.html" data-type="entity-link">Database</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DefaultAuthObject.html" data-type="entity-link">DefaultAuthObject</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IBaseController.html" data-type="entity-link">IBaseController</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPagedListDto.html" data-type="entity-link">IPagedListDto</a>
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