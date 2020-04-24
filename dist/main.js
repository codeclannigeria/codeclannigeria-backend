/******/ (function(modules) { // webpackBootstrap
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadUpdateChunk(chunkId) {
/******/ 		var chunk = require("./" + "" + chunkId + "." + hotCurrentHash + ".hot-update.js");
/******/ 		hotAddUpdateChunk(chunk.id, chunk.modules);
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotDownloadManifest() {
/******/ 		try {
/******/ 			var update = require("./" + "" + hotCurrentHash + ".hot-update.json");
/******/ 		} catch (e) {
/******/ 			return Promise.resolve();
/******/ 		}
/******/ 		return Promise.resolve(update);
/******/ 	}
/******/
/******/ 	//eslint-disable-next-line no-unused-vars
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/
/******/ 	var hotApplyOnUpdate = true;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentHash = "9704b3bb2e1d630a7759";
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule;
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParents = [];
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = [];
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateRequire(moduleId) {
/******/ 		var me = installedModules[moduleId];
/******/ 		if (!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if (me.hot.active) {
/******/ 				if (installedModules[request]) {
/******/ 					if (installedModules[request].parents.indexOf(moduleId) === -1) {
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 					}
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if (me.children.indexOf(request) === -1) {
/******/ 					me.children.push(request);
/******/ 				}
/******/ 			} else {
/******/ 				console.warn(
/******/ 					"[HMR] unexpected require(" +
/******/ 						request +
/******/ 						") from disposed module " +
/******/ 						moduleId
/******/ 				);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for (var name in __webpack_require__) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(__webpack_require__, name) &&
/******/ 				name !== "e" &&
/******/ 				name !== "t"
/******/ 			) {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if (hotStatus === "ready") hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if (hotStatus === "prepare") {
/******/ 					if (!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if (hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		fn.t = function(value, mode) {
/******/ 			if (mode & 1) value = fn(value);
/******/ 			return __webpack_require__.t(value, mode & ~1);
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotCreateModule(moduleId) {
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if (dep === undefined) hot._selfAccepted = true;
/******/ 				else if (typeof dep === "function") hot._selfAccepted = dep;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if (dep === undefined) hot._selfDeclined = true;
/******/ 				else if (typeof dep === "object")
/******/ 					for (var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if (idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if (!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if (idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for (var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = +id + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/
/******/ 	function hotCheck(apply) {
/******/ 		if (hotStatus !== "idle") {
/******/ 			throw new Error("check() is only allowed in idle status");
/******/ 		}
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if (!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			// eslint-disable-next-line no-lone-blocks
/******/ 			{
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if (
/******/ 				hotStatus === "prepare" &&
/******/ 				hotChunksLoading === 0 &&
/******/ 				hotWaitingFiles === 0
/******/ 			) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/
/******/ 	// eslint-disable-next-line no-unused-vars
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) {
/******/ 		if (!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for (var moduleId in moreModules) {
/******/ 			if (Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if (--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if (!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if (!deferred) return;
/******/ 		if (hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve()
/******/ 				.then(function() {
/******/ 					return hotApply(hotApplyOnUpdate);
/******/ 				})
/******/ 				.then(
/******/ 					function(result) {
/******/ 						deferred.resolve(result);
/******/ 					},
/******/ 					function(err) {
/******/ 						deferred.reject(err);
/******/ 					}
/******/ 				);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for (var id in hotUpdate) {
/******/ 				if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/
/******/ 	function hotApply(options) {
/******/ 		if (hotStatus !== "ready")
/******/ 			throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/
/******/ 			var queue = outdatedModules.map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while (queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if (!module || module.hot._selfAccepted) continue;
/******/ 				if (module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if (module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for (var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if (!parent) continue;
/******/ 					if (parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if (outdatedModules.indexOf(parentId) !== -1) continue;
/******/ 					if (parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if (!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/
/******/ 		function addAllToSet(a, b) {
/******/ 			for (var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if (a.indexOf(item) === -1) a.push(item);
/******/ 			}
/******/ 		}
/******/
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn(
/******/ 				"[HMR] unexpected require(" + result.moduleId + ") to disposed module"
/******/ 			);
/******/ 		};
/******/
/******/ 		for (var id in hotUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				/** @type {TODO} */
/******/ 				var result;
/******/ 				if (hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				/** @type {Error|false} */
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if (result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch (result.type) {
/******/ 					case "self-declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of self decline: " +
/******/ 									result.moduleId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if (options.onDeclined) options.onDeclined(result);
/******/ 						if (!options.ignoreDeclined)
/******/ 							abortError = new Error(
/******/ 								"Aborted because of declined dependency: " +
/******/ 									result.moduleId +
/******/ 									" in " +
/******/ 									result.parentId +
/******/ 									chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if (options.onUnaccepted) options.onUnaccepted(result);
/******/ 						if (!options.ignoreUnaccepted)
/******/ 							abortError = new Error(
/******/ 								"Aborted because " + moduleId + " is not accepted" + chainInfo
/******/ 							);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if (options.onAccepted) options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if (options.onDisposed) options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if (abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if (doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for (moduleId in result.outdatedDependencies) {
/******/ 						if (
/******/ 							Object.prototype.hasOwnProperty.call(
/******/ 								result.outdatedDependencies,
/******/ 								moduleId
/******/ 							)
/******/ 						) {
/******/ 							if (!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(
/******/ 								outdatedDependencies[moduleId],
/******/ 								result.outdatedDependencies[moduleId]
/******/ 							);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if (doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for (i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if (
/******/ 				installedModules[moduleId] &&
/******/ 				installedModules[moduleId].hot._selfAccepted &&
/******/ 				// removed self-accepted modules should not be required
/******/ 				appliedUpdate[moduleId] !== warnUnexpectedRequire
/******/ 			) {
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if (hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while (queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if (!module) continue;
/******/
/******/ 			var data = {};
/******/
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for (j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/
/******/ 			// remove "parents" references from all children
/******/ 			for (j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if (!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if (idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for (j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if (idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Now in "apply" phase
/******/ 		hotSetStatus("apply");
/******/
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/
/******/ 		// insert new code
/******/ 		for (moduleId in appliedUpdate) {
/******/ 			if (Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for (moduleId in outdatedDependencies) {
/******/ 			if (
/******/ 				Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)
/******/ 			) {
/******/ 				module = installedModules[moduleId];
/******/ 				if (module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for (i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if (cb) {
/******/ 							if (callbacks.indexOf(cb) !== -1) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for (i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch (err) {
/******/ 							if (options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if (!options.ignoreErrored) {
/******/ 								if (!error) error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// Load self accepted modules
/******/ 		for (i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch (err) {
/******/ 				if (typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch (err2) {
/******/ 						if (options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if (!options.ignoreErrored) {
/******/ 							if (!error) error = err2;
/******/ 						}
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if (options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if (!options.ignoreErrored) {
/******/ 						if (!error) error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if (error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(0)(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
module.exports = function(updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function(moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__("./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function(moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function(moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function(moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				"[HMR] Consider using the NamedModulesPlugin for module names."
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/***/ (function(module, exports) {

var logLevel = "info";

function dummy() {}

function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

function logGroup(logFn) {
	return function(level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

module.exports = function(level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

/* eslint-disable node/no-unsupported-features/node-builtins */
var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;
/* eslint-enable node/no-unsupported-features/node-builtins */

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

module.exports.setLogLevel = function(level) {
	logLevel = level;
};

module.exports.formatError = function(err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/poll.js?100":
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery) {/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/*globals __resourceQuery */
if (true) {
	var hotPollInterval = +__resourceQuery.substr(1) || 10 * 60 * 1000;
	var log = __webpack_require__("./node_modules/webpack/hot/log.js");

	var checkForUpdate = function checkForUpdate(fromUpdate) {
		if (module.hot.status() === "idle") {
			module.hot
				.check(true)
				.then(function(updatedModules) {
					if (!updatedModules) {
						if (fromUpdate) log("info", "[HMR] Update applied.");
						return;
					}
					__webpack_require__("./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);
					checkForUpdate(true);
				})
				.catch(function(err) {
					var status = module.hot.status();
					if (["abort", "fail"].indexOf(status) >= 0) {
						log("warning", "[HMR] Cannot apply update.");
						log("warning", "[HMR] " + log.formatError(err));
						log("warning", "[HMR] You need to restart the application!");
					} else {
						log("warning", "[HMR] Update failed: " + log.formatError(err));
					}
				});
		}
	};
	setInterval(checkForUpdate, hotPollInterval);
} else {}

/* WEBPACK VAR INJECTION */}.call(this, "?100"))

/***/ }),

/***/ "./src/app.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
const auth_controller_1 = __webpack_require__("./src/auth/auth.controller.ts");
const auth_module_1 = __webpack_require__("./src/auth/auth.module.ts");
const users_module_1 = __webpack_require__("./src/users/users.module.ts");
const shared_1 = __webpack_require__("./src/shared/index.ts");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            shared_1.AbstractModule.forRoot(),
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            mongoose_1.MongooseModule.forRoot('mongodb://localhost/nest', {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                useCreateIndex: true,
                useFindAndModify: false,
            }),
        ],
        controllers: [auth_controller_1.AuthController],
    })
], AppModule);
exports.AppModule = AppModule;


/***/ }),

/***/ "./src/auth/auth.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./src/auth/auth.service.ts");
const jwt_auth_guard_1 = __webpack_require__("./src/auth/guards/jwt-auth.guard.ts");
const auth_dto_1 = __webpack_require__("./src/auth/models/dto/auth.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(authDto, req) {
        req.user;
        return this.authService.login({ password: authDto.password });
    }
    async getProfile(req) {
        return req.user;
    }
};
__decorate([
    common_1.Post('login'),
    openapi.ApiResponse({ status: 201 }),
    __param(0, common_1.Body()), __param(1, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [auth_dto_1.AuthDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('profile'),
    openapi.ApiResponse({ status: 200, type: Object }),
    __param(0, common_1.Req()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "getProfile", null);
AuthController = __decorate([
    swagger_1.ApiTags('Auth'),
    common_1.Controller('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
exports.AuthController = AuthController;


/***/ }),

/***/ "./src/auth/auth.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const auth_service_1 = __webpack_require__("./src/auth/auth.service.ts");
const users_module_1 = __webpack_require__("./src/users/users.module.ts");
const passport_1 = __webpack_require__("@nestjs/passport");
const jwt_1 = __webpack_require__("@nestjs/jwt");
const constants_1 = __webpack_require__("./src/auth/constants.ts");
const local_strategy_1 = __webpack_require__("./src/auth/strategies/local.strategy.ts");
const jwt_strategy_1 = __webpack_require__("./src/auth/strategies/jwt.strategy.ts");
let AuthModule = class AuthModule {
};
AuthModule = __decorate([
    common_1.Module({
        imports: [
            passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
            jwt_1.JwtModule.register({
                secret: constants_1.jwtConstants.secret,
                signOptions: { expiresIn: '60s' },
            }),
            users_module_1.UsersModule,
        ],
        providers: [auth_service_1.AuthService, local_strategy_1.LocalStrategy, jwt_strategy_1.JwtStrategy],
        exports: [auth_service_1.AuthService, jwt_1.JwtModule],
    })
], AuthModule);
exports.AuthModule = AuthModule;


/***/ }),

/***/ "./src/auth/auth.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./src/users/users.service.ts");
const jwt_1 = __webpack_require__("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(usersService, jwtService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
    }
    async validateUser(username, pass) {
        const user = await this.usersService.findOne(username);
        if (user && user.password === pass) {
            const result = __rest(user, []);
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.username, sub: user.userId };
        return {
            accessToken: this.jwtService.sign(payload),
        };
    }
};
AuthService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;


/***/ }),

/***/ "./src/auth/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = {
    secret: 'S1JJFHHG985',
};


/***/ }),

/***/ "./src/auth/guards/jwt-auth.guard.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
let JwtAuthGuard = class JwtAuthGuard extends passport_1.AuthGuard('jwt') {
};
JwtAuthGuard = __decorate([
    common_1.Injectable()
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;


/***/ }),

/***/ "./src/auth/models/dto/auth.dto.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const class_validator_1 = __webpack_require__("class-validator");
class AuthDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsEmail(),
    __metadata("design:type", String)
], AuthDto.prototype, "email", void 0);
__decorate([
    class_validator_1.IsNotEmpty(),
    __metadata("design:type", String)
], AuthDto.prototype, "password", void 0);
exports.AuthDto = AuthDto;


/***/ }),

/***/ "./src/auth/strategies/jwt.strategy.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_jwt_1 = __webpack_require__("passport-jwt");
const passport_1 = __webpack_require__("@nestjs/passport");
const common_1 = __webpack_require__("@nestjs/common");
const constants_1 = __webpack_require__("./src/auth/constants.ts");
let JwtStrategy = class JwtStrategy extends passport_1.PassportStrategy(passport_jwt_1.Strategy) {
    constructor() {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: constants_1.jwtConstants.secret,
        });
    }
    async validate(payload) {
        return { userId: payload.sub, username: payload.username };
    }
};
JwtStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], JwtStrategy);
exports.JwtStrategy = JwtStrategy;


/***/ }),

/***/ "./src/auth/strategies/local.strategy.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const passport_1 = __webpack_require__("@nestjs/passport");
const passport_local_1 = __webpack_require__("passport-local");
const auth_service_1 = __webpack_require__("./src/auth/auth.service.ts");
let LocalStrategy = class LocalStrategy extends passport_1.PassportStrategy(passport_local_1.Strategy) {
    constructor(moduleRef) {
        super({
            passReqToCallback: true,
        });
        this.moduleRef = moduleRef;
    }
    async validate(request, username, password) {
        const contextId = core_1.ContextIdFactory.getByRequest(request);
        const authService = await this.moduleRef.resolve(auth_service_1.AuthService, contextId);
        const user = await authService.validateUser(username, password);
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
};
LocalStrategy = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [core_1.ModuleRef])
], LocalStrategy);
exports.LocalStrategy = LocalStrategy;


/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const core_1 = __webpack_require__("@nestjs/core");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const compression = __webpack_require__("compression");
const rateLimit = __webpack_require__("express-rate-limit");
const helmet = __webpack_require__("helmet");
const app_module_1 = __webpack_require__("./src/app.module.ts");
const http_exception_filter_1 = __webpack_require__("./src/shared/filters/http-exception.filter.ts");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    app.use(helmet());
    app.use(rateLimit({
        windowMs: 15 * 60 * 1000,
        max: 100,
    }));
    app.use(compression());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const options = new swagger_1.DocumentBuilder()
        .setTitle('ToRead API')
        .setDescription('ToRead API description')
        .setVersion('1.0')
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, options);
    swagger_1.SwaggerModule.setup('api', app, document);
    await app.listen(3000);
    if (true) {
        module.hot.accept();
        module.hot.dispose(() => app.close());
    }
}
bootstrap();


/***/ }),

/***/ "./src/shared/abstract-core.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class AbstractCoreService {
}
exports.AbstractCoreService = AbstractCoreService;


/***/ }),

/***/ "./src/shared/abstract-mongoose.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __webpack_require__("mongoose");
const abstract_core_service_1 = __webpack_require__("./src/shared/abstract-core.service.ts");
class AbstractMongooseService extends abstract_core_service_1.AbstractCoreService {
    constructor(model) {
        super();
        this._model = model;
        AbstractMongooseService.model = model;
    }
    async find(filter = {}) {
        return this._model.find(filter).exec();
    }
    async findById(id) {
        return this._model.findById(this.toObjectId(id)).exec();
    }
    async findOne(filter = {}) {
        return this._model.findOne(filter).exec();
    }
    async create(doc) {
        return this._model.create(doc);
    }
    async update(id, updatedDoc) {
        return (await this._model
            .findByIdAndUpdate(this.toObjectId(id), updatedDoc)
            .exec());
    }
    async delete(id) {
        return (await this._model
            .findByIdAndDelete(this.toObjectId(id))
            .exec());
    }
    toObjectId(id) {
        return mongoose_1.Types.ObjectId(id);
    }
}
exports.AbstractMongooseService = AbstractMongooseService;


/***/ }),

/***/ "./src/shared/abstract.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var AbstractModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const abstract_core_service_1 = __webpack_require__("./src/shared/abstract-core.service.ts");
const abstract_mongoose_service_1 = __webpack_require__("./src/shared/abstract-mongoose.service.ts");
let AbstractModule = AbstractModule_1 = class AbstractModule {
    static forRoot() {
        return {
            module: AbstractModule_1,
            providers: [
                { provide: abstract_core_service_1.AbstractCoreService, useClass: abstract_mongoose_service_1.AbstractMongooseService },
            ],
        };
    }
};
AbstractModule = AbstractModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], AbstractModule);
exports.AbstractModule = AbstractModule;


/***/ }),

/***/ "./src/shared/base.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_transformer_1 = __webpack_require__("class-transformer");
const api_exception_model_1 = __webpack_require__("./src/shared/models/api-exception.model.ts");
const paged_dto_1 = __webpack_require__("./src/shared/models/dto/paged.dto.ts");
function AbstractCrudController(options) {
    const { entity, entityDto, createDto } = options;
    class BaseController {
        constructor(baseService) {
            this.baseService = baseService;
        }
        async findAll(query) {
            const { skip, limit, search } = query;
            const entities = await this.baseService
                .findAll(search && { $text: { $search: search } })
                .limit(limit)
                .skip(skip);
            const totalCount = entities.length <= limit ? entities.length : limit;
            const items = class_transformer_1.plainToClass(entityDto, entities, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
            return new paged_dto_1.PagedResDto(totalCount, items, entityDto);
        }
        async findById(id) {
            const entity = await this.baseService.findByIdAsync(id);
            if (!entity)
                throw new common_1.NotFoundException(`Entity with id ${id} does not exist`);
            return class_transformer_1.plainToClass(entityDto, entity, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        }
        async create(input) {
            const newEntity = this.baseService.createEntity(input);
            await this.baseService.insertAsync(newEntity);
            return newEntity.id;
        }
        async delete(id) {
            this.baseService.deleteByIdAsync(id);
        }
        async update(id, input) {
            const existed = await this.baseService.findByIdAsync(id);
            if (!existed)
                throw new common_1.NotFoundException(`Entity with Id ${id} does not exist`);
            const value = class_transformer_1.plainToClass(entity, existed, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
            const updatedDoc = Object.assign(Object.assign({}, value), input);
            console.log(updatedDoc);
            const result = await this.baseService.updateAsync(id, updatedDoc);
            return class_transformer_1.plainToClass(entityDto, result, {
                excludeExtraneousValues: true,
                enableImplicitConversion: true,
            });
        }
    }
    __decorate([
        common_1.Get(),
        swagger_1.ApiOkResponse({}),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [paged_dto_1.PagedReqDto]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "findAll", null);
    __decorate([
        common_1.Get(':id'),
        swagger_1.ApiOkResponse({ description: 'Entity retrieved successfully.' }),
        swagger_1.ApiNotFoundResponse({
            type: api_exception_model_1.ApiException,
            description: 'Entity does not exist',
        }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.CREATED }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.FORBIDDEN }),
        swagger_1.ApiResponse({ status: common_1.HttpStatus.BAD_REQUEST }),
        openapi.ApiResponse({ status: 201, type: String }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "create", null);
    __decorate([
        common_1.Delete(':id'),
        swagger_1.ApiOkResponse(),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "delete", null);
    __decorate([
        common_1.Put(':id'),
        swagger_1.ApiBadRequestResponse({ type: api_exception_model_1.ApiException }),
        swagger_1.ApiOkResponse(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], BaseController.prototype, "update", null);
    return BaseController;
}
exports.AbstractCrudController = AbstractCrudController;


/***/ }),

/***/ "./src/shared/base.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const mongoose_1 = __webpack_require__("mongoose");
class BaseService {
    constructor(entity) {
        this.entity = entity;
    }
    static throwMongoError(err) {
        throw new common_1.InternalServerErrorException(err, err.errmsg);
    }
    static toObjectId(id) {
        try {
            return mongoose_1.Types.ObjectId(id);
        }
        catch (e) {
            this.throwMongoError(e);
        }
    }
    createEntity(doc) {
        return new this.entity(doc);
    }
    insert(entity) {
        return this.entity.create(entity);
    }
    async insertAsync(entity) {
        try {
            return await this.insert(entity);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findAll(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.find(filter);
    }
    async findAllAsync(filter = {}) {
        try {
            return await this.findAll(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findOne(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOne(filter);
    }
    async findOneAsync(filter = {}) {
        try {
            return await this.findOne(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    findById(id) {
        return this.entity
            .findById(BaseService.toObjectId(id))
            .where('isDeleted')
            .ne(true);
    }
    async findByIdAsync(id) {
        try {
            return await this.findById(id).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    async create(item) {
        try {
            return await this.entity.create(item);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    delete(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOneAndDelete(filter);
    }
    softDelete(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.findOneAndUpdate(filter, { isDeleted: true });
    }
    async deleteAsync(filter = {}) {
        try {
            return await this.softDelete(filter).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    deleteById(id) {
        return this.entity
            .findByIdAndDelete(BaseService.toObjectId(id))
            .where('isDeleted')
            .ne(true);
    }
    softDeleteById(id) {
        return this.entity
            .findByIdAndUpdate(BaseService.toObjectId(id), { isDeleted: true })
            .where('isDeleted')
            .ne(true);
    }
    async deleteByIdAsync(id) {
        try {
            return await this.softDeleteById(id).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    update(id, item) {
        return this.entity
            .findByIdAndUpdate(BaseService.toObjectId(id), item, {
            new: true,
        })
            .where('isDeleted')
            .ne(true);
    }
    async updateAsync(id, item) {
        try {
            return await this.update(id, item).exec();
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
    count(filter = {}) {
        filter = Object.assign(Object.assign({}, filter), { isDeleted: { $ne: true } });
        return this.entity.countDocuments(filter);
    }
    async countAsync(filter = {}) {
        try {
            return await this.count(filter);
        }
        catch (e) {
            BaseService.throwMongoError(e);
        }
    }
}
exports.BaseService = BaseService;


/***/ }),

/***/ "./src/shared/constants copy.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.PACKAGES = {
    Mongoose: 'mongoose',
    TypeOrm: 'typeorm',
    Passport: 'passport',
    Swagger: 'swagger',
};
exports.AUTH_GUARD_TYPE = 'jwt';


/***/ }),

/***/ "./src/shared/constants.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.columnSize = {
    length8: 2 ** 3,
    length16: 2 ** 4,
    length32: 2 ** 5,
    length64: 2 ** 6,
    length128: 2 ** 7,
    length256: 2 ** 8,
    length512: 2 ** 9,
    length1024: 2 ** 10,
};


/***/ }),

/***/ "./src/shared/controllers/abstract-with-auth.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const constants_copy_1 = __webpack_require__("./src/shared/constants copy.ts");
const decorators_1 = __webpack_require__("./src/shared/decorators/index.ts");
const utils_1 = __webpack_require__("./src/shared/utils/index.ts");
function abstractControllerWithAuth(options) {
    const model = options.model;
    const auth = utils_1.getAuthObj(options.auth);
    class AbstractController {
        constructor(service) {
            this._service = service;
        }
        async find(filter) {
            const findFilter = filter ? JSON.parse(filter) : {};
            try {
                return this._service.find(findFilter);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async findById(id) {
            try {
                return this._service.findById(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async create(doc) {
            try {
                const newObject = new model(doc);
                return this._service.create(newObject);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async update(id, doc) {
            try {
                const existed = await this._service.findById(id);
                const updatedDoc = Object.assign(Object.assign({}, existed), doc);
                return this._service.update(id, updatedDoc);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async delete(id) {
            try {
                return this._service.delete(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
    }
    __decorate([
        common_1.Get(),
        decorators_1.Authenticate(!!auth && auth.find, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query('filter')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "find", null);
    __decorate([
        common_1.Get(':id'),
        decorators_1.Authenticate(!!auth && auth.findById, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        decorators_1.Authenticate(!!auth && auth.create, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        openapi.ApiResponse({ status: 201 }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "create", null);
    __decorate([
        common_1.Put(':id'),
        decorators_1.Authenticate(!!auth && auth.update, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "update", null);
    __decorate([
        common_1.Delete(':id'),
        decorators_1.Authenticate(!!auth && auth.delete, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "delete", null);
    return AbstractController;
}
exports.abstractControllerWithAuth = abstractControllerWithAuth;


/***/ }),

/***/ "./src/shared/controllers/abstract-with-swagger.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const passport_1 = __webpack_require__("@nestjs/passport");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const abstract_core_service_1 = __webpack_require__("./src/shared/abstract-core.service.ts");
const constants_copy_1 = __webpack_require__("./src/shared/constants copy.ts");
const decorators_1 = __webpack_require__("./src/shared/decorators/index.ts");
const utils_1 = __webpack_require__("./src/shared/utils/index.ts");
function abstractControllerWithSwagger(options) {
    const { model, modelVm, modelCreate } = options;
    const auth = utils_1.getAuthObj(options.auth);
    let AbstractController = class AbstractController {
        constructor(service) {
            this._service = service;
        }
        async find(filter) {
            const findFilter = filter ? JSON.parse(filter) : {};
            try {
                return this._service.find(findFilter);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async findById(id) {
            try {
                return this._service.findById(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async create(doc) {
            try {
                const newObject = new model(doc);
                return this._service.create(newObject);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async update(id, doc) {
            try {
                const existed = await this._service.findById(id);
                const updatedDoc = Object.assign(Object.assign({}, existed), doc);
                return this._service.update(id, updatedDoc);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async delete(id) {
            try {
                return this._service.delete(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
    };
    __decorate([
        common_1.Get(),
        decorators_1.Authenticate(!!auth && auth.find, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.find, swagger_1.ApiBearerAuth()),
        swagger_1.ApiQuery({
            name: 'filter',
            description: 'Find Query',
            required: false,
            isArray: false,
        }),
        swagger_1.ApiOkResponse({ type: modelVm, isArray: true }),
        decorators_1.ApiSwaggerOperation({ title: 'FindAll' }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query('filter')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "find", null);
    __decorate([
        common_1.Get(':id'),
        decorators_1.Authenticate(!!auth && auth.findById, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.findById, swagger_1.ApiBearerAuth()),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'FindById' }),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        decorators_1.Authenticate(!!auth && auth.create, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.create, swagger_1.ApiBearerAuth()),
        swagger_1.ApiBody({
            type: modelCreate,
            description: 'Data for model creation',
            required: true,
            isArray: false,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Create' }),
        openapi.ApiResponse({ status: 201 }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "create", null);
    __decorate([
        common_1.Put(':id'),
        decorators_1.Authenticate(!!auth && auth.update, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.update, swagger_1.ApiBearerAuth()),
        swagger_1.ApiBody({
            type: modelVm,
            description: 'Data for object update',
            required: true,
            isArray: false,
        }),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Update' }),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "update", null);
    __decorate([
        common_1.Delete(':id'),
        decorators_1.Authenticate(!!auth && auth.delete, common_1.UseGuards(passport_1.AuthGuard(constants_copy_1.AUTH_GUARD_TYPE))),
        decorators_1.Authenticate(!!auth && auth.delete, swagger_1.ApiBearerAuth()),
        swagger_1.ApiParam({
            name: 'id',
            required: true,
            description: 'Id of Object',
            type: String,
        }),
        swagger_1.ApiOkResponse({ type: modelVm }),
        decorators_1.ApiSwaggerOperation({ title: 'Delete' }),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "delete", null);
    AbstractController = __decorate([
        swagger_1.ApiTags(model.name),
        __metadata("design:paramtypes", [abstract_core_service_1.AbstractCoreService])
    ], AbstractController);
    return AbstractController;
}
exports.abstractControllerWithSwagger = abstractControllerWithSwagger;


/***/ }),

/***/ "./src/shared/controllers/abstract.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
function abstractControllerFactory(options) {
    const model = options.model;
    class AbstractController {
        constructor(service) {
            this._service = service;
        }
        async find(filter) {
            const findFilter = filter ? JSON.parse(filter) : {};
            try {
                return this._service.find(findFilter);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async findById(id) {
            try {
                return this._service.findById(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async create(input) {
            try {
                const newObject = new model(input);
                return this._service.create(newObject);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async update(id, doc) {
            try {
                const existed = await this._service.findById(id);
                const updatedDoc = Object.assign(Object.assign({}, existed), doc);
                return this._service.update(id, updatedDoc);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
        async delete(id) {
            try {
                return this._service.delete(id);
            }
            catch (e) {
                throw new common_1.InternalServerErrorException(e);
            }
        }
    }
    __decorate([
        common_1.Get(),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Query('filter')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "find", null);
    __decorate([
        common_1.Get(':id'),
        openapi.ApiResponse({ status: 200 }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "findById", null);
    __decorate([
        common_1.Post(),
        openapi.ApiResponse({ status: 201 }),
        __param(0, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "create", null);
    __decorate([
        common_1.Put(':id'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __param(1, common_1.Body()),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String, Object]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "update", null);
    __decorate([
        common_1.Delete(':id'),
        openapi.ApiResponse({ status: 200, type: Object }),
        __param(0, common_1.Param('id')),
        __metadata("design:type", Function),
        __metadata("design:paramtypes", [String]),
        __metadata("design:returntype", Promise)
    ], AbstractController.prototype, "delete", null);
    return AbstractController;
}
exports.abstractControllerFactory = abstractControllerFactory;


/***/ }),

/***/ "./src/shared/controllers/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/controllers/abstract.controller.ts"));
__export(__webpack_require__("./src/shared/controllers/abstract-with-auth.controller.ts"));
__export(__webpack_require__("./src/shared/controllers/abstract-with-swagger.controller.ts"));


/***/ }),

/***/ "./src/shared/decorators/api-swagger-operation.decorator.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__("@nestjs/swagger");
exports.ApiSwaggerOperation = (options) => {
    return (target, propertyKey, descriptor) => {
        const controllerName = target.constructor.name;
        swagger_1.ApiOperation(Object.assign(Object.assign({}, options), { operationId: `${controllerName.substr(0, controllerName.indexOf('Controller'))}_${propertyKey}` }))(target, propertyKey, descriptor);
    };
};


/***/ }),

/***/ "./src/shared/decorators/authenticate.decorator.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.Authenticate = (isAuthEnable, decorator) => {
    return (target, key, value) => {
        if (isAuthEnable) {
            decorator(target, key, value);
        }
    };
};


/***/ }),

/***/ "./src/shared/decorators/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/decorators/authenticate.decorator.ts"));
__export(__webpack_require__("./src/shared/decorators/api-swagger-operation.decorator.ts"));


/***/ }),

/***/ "./src/shared/filters/http-exception.filter.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const api_exception_model_1 = __webpack_require__("./src/shared/models/api-exception.model.ts");
let HttpExceptionFilter = class HttpExceptionFilter {
    catch(error, host) {
        const ctx = host.switchToHttp();
        const res = ctx.getResponse();
        const req = ctx.getRequest();
        const statusCode = error.getStatus();
        const stacktrace = error.stack;
        const errorName = error.response.name || error.response.error || error.name;
        const errors = error.response.errors || null;
        const path = req ? req.url : null;
        if (statusCode === common_1.HttpStatus.UNAUTHORIZED) {
            if (typeof error.response !== 'string') {
                error.response.message =
                    error.response.message ||
                        'You do not have permission to access this resource';
            }
        }
        const exception = new api_exception_model_1.ApiException(error.response.message, errorName, stacktrace, errors, path, statusCode);
        res.status(statusCode).json(exception);
    }
};
HttpExceptionFilter = __decorate([
    common_1.Catch(common_1.HttpException)
], HttpExceptionFilter);
exports.HttpExceptionFilter = HttpExceptionFilter;


/***/ }),

/***/ "./src/shared/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/models/index.ts"));
__export(__webpack_require__("./src/shared/interfaces/index.ts"));
__export(__webpack_require__("./src/shared/controllers/index.ts"));
__export(__webpack_require__("./src/shared/abstract.module.ts"));
__export(__webpack_require__("./src/shared/abstract-core.service.ts"));
__export(__webpack_require__("./src/shared/abstract-mongoose.service.ts"));


/***/ }),

/***/ "./src/shared/interfaces/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/interfaces/object-mapping.enum.ts"));


/***/ }),

/***/ "./src/shared/interfaces/object-mapping.enum.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
var ObjectMapping;
(function (ObjectMapping) {
    ObjectMapping["Mongoose"] = "mongoose";
})(ObjectMapping = exports.ObjectMapping || (exports.ObjectMapping = {}));


/***/ }),

/***/ "./src/shared/models/abstract-vm.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_1 = __webpack_require__("@nestjs/swagger");
class AbstractVm {
}
__decorate([
    swagger_1.ApiPropertyOptional({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], AbstractVm.prototype, "createdAt", void 0);
__decorate([
    swagger_1.ApiPropertyOptional({ type: String, format: 'date-time' }),
    __metadata("design:type", Date)
], AbstractVm.prototype, "updatedAt", void 0);
__decorate([
    swagger_1.ApiPropertyOptional(),
    __metadata("design:type", String)
], AbstractVm.prototype, "id", void 0);
exports.AbstractVm = AbstractVm;


/***/ }),

/***/ "./src/shared/models/api-exception.model.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class ApiException {
    constructor(message, error, stack, errors, path, statusCode) {
        this.message = message;
        this.error = error;
        this.stack = stack;
        this.errors = errors;
        this.path = path;
        this.timestamp = new Date().toISOString();
        this.statusCode = statusCode;
        this.status = common_1.HttpStatus[statusCode];
    }
}
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], ApiException.prototype, "statusCode", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "message", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "status", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "error", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Object)
], ApiException.prototype, "errors", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "timestamp", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "path", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], ApiException.prototype, "stack", void 0);
exports.ApiException = ApiException;


/***/ }),

/***/ "./src/shared/models/base.entity.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const typegoose_1 = __webpack_require__("@typegoose/typegoose");
const defaultClasses_1 = __webpack_require__("@typegoose/typegoose/lib/defaultClasses");
class BaseEntity extends defaultClasses_1.TimeStamps {
    constructor() {
        super(...arguments);
        this.isDeleted = false;
        this.createdBy = null;
        this.updatedBy = null;
        this.isActive = true;
        this.deletedBy = null;
        this.createdAt = new Date();
        this.updatedAt = null;
    }
    static get schema() {
        return typegoose_1.buildSchema(this, {
            timestamps: true,
            toJSON: {
                getters: true,
                virtuals: true,
                versionKey: false,
                transform: (_, ret) => {
                    ret.id = ret._id;
                    delete ret._id;
                },
            },
        });
    }
    static get modelName() {
        return this.name;
    }
    delete() {
        this.isDeleted = true;
    }
    restore() {
        this.isDeleted = false;
    }
    deactivate() {
        this.isActive = false;
    }
    activate() {
        this.isActive = true;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, isDeleted: { required: true, type: () => Boolean, default: false }, createdBy: { required: false, type: () => Object, default: null }, updatedBy: { required: false, type: () => Object, default: null }, isActive: { required: true, type: () => Boolean, default: true }, deletedBy: { required: false, type: () => Object, default: null }, deletedAt: { required: false, type: () => Date }, createdAt: { required: true, type: () => Date, default: new Date() }, updatedAt: { required: true, type: () => Date, default: null } };
    }
}
__decorate([
    typegoose_1.prop({ required: true, default: false }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isDeleted", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "createdBy", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "updatedBy", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: true }),
    __metadata("design:type", Boolean)
], BaseEntity.prototype, "isActive", void 0);
__decorate([
    typegoose_1.prop({ default: null, ref: BaseEntity }),
    __metadata("design:type", Object)
], BaseEntity.prototype, "deletedBy", void 0);
__decorate([
    typegoose_1.prop({ default: null }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "deletedAt", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date() }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "createdAt", void 0);
__decorate([
    typegoose_1.prop({ required: true, default: new Date() }),
    __metadata("design:type", Date)
], BaseEntity.prototype, "updatedAt", void 0);
exports.BaseEntity = BaseEntity;


/***/ }),

/***/ "./src/shared/models/dto/paged.dto.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const class_transformer_1 = __webpack_require__("class-transformer");
const class_validator_1 = __webpack_require__("class-validator");
class PagedResDto {
    constructor(totalCount, items, type) {
        this.items = items;
        this.type = type;
        this.totalCount = totalCount;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { type: { required: true, type: () => Object }, totalCount: { required: true, type: () => Number }, items: { required: true } };
    }
}
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Function)
], PagedResDto.prototype, "type", void 0);
__decorate([
    swagger_1.ApiProperty(),
    __metadata("design:type", Number)
], PagedResDto.prototype, "totalCount", void 0);
__decorate([
    swagger_1.ApiProperty({
        isArray: true,
        type: this.type,
    }),
    class_transformer_1.Type(options => {
        return options.newObject.type;
    }),
    __metadata("design:type", Array)
], PagedResDto.prototype, "items", void 0);
exports.PagedResDto = PagedResDto;
class PagedReqDto {
    constructor() {
        this.skip = 0;
        this.limit = 100;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { skip: { required: false, type: () => Number, default: 0 }, limit: { required: false, type: () => Number, default: 100 }, search: { required: false, type: () => String } };
    }
}
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PagedReqDto.prototype, "skip", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", Number)
], PagedReqDto.prototype, "limit", void 0);
__decorate([
    class_validator_1.IsOptional(),
    __metadata("design:type", String)
], PagedReqDto.prototype, "search", void 0);
exports.PagedReqDto = PagedReqDto;
function PaginatedResponseDto(entityDto) {
    class Paged extends entityDto {
        static _OPENAPI_METADATA_FACTORY() {
            return { totalCount: { required: true, type: () => Number }, items: { required: true } };
        }
    }
    __decorate([
        swagger_1.ApiProperty(),
        __metadata("design:type", Number)
    ], Paged.prototype, "totalCount", void 0);
    __decorate([
        swagger_1.ApiProperty({
            type: entityDto,
            isArray: true,
        }),
        __metadata("design:type", Array)
    ], Paged.prototype, "items", void 0);
    return Paged;
}
exports.PaginatedResponseDto = PaginatedResponseDto;


/***/ }),

/***/ "./src/shared/models/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/models/abstract-vm.model.ts"));


/***/ }),

/***/ "./src/shared/utils/get-auth-obj.util.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultAuthObj = {
    find: true,
    findById: true,
    create: true,
    update: true,
    delete: true,
};
exports.getAuthObj = (authObj) => {
    let auth = null;
    if (!!authObj) {
        return auth;
    }
    if (authObj === true) {
        auth = exports.defaultAuthObj;
    }
    else if (authObj === false) {
        auth = {
            find: false,
            findById: false,
            create: false,
            update: false,
            delete: false,
        };
    }
    else {
        auth = Object.assign(Object.assign({}, exports.defaultAuthObj), authObj);
    }
    return auth;
};


/***/ }),

/***/ "./src/shared/utils/index.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__("./src/shared/utils/get-auth-obj.util.ts"));


/***/ }),

/***/ "./src/users/models/dto/create-user.dto.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const user_dto_1 = __webpack_require__("./src/users/models/dto/user.dto.ts");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class CreateUserDto extends swagger_1.OmitType(user_dto_1.UserDto, ['id']) {
}
exports.CreateUserDto = CreateUserDto;


/***/ }),

/***/ "./src/users/models/dto/user.dto.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const constants_1 = __webpack_require__("./src/shared/constants.ts");
const class_validator_1 = __webpack_require__("class-validator");
const class_transformer_1 = __webpack_require__("class-transformer");
const swagger_1 = __webpack_require__("@nestjs/swagger");
class UserDto {
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, firstName: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, lastName: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, password: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 }, email: { required: true, type: () => String, maxLength: constants_1.columnSize.length64 } };
    }
}
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.IsMongoId(),
    swagger_1.ApiProperty(),
    __metadata("design:type", String)
], UserDto.prototype, "id", void 0);
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    swagger_1.ApiProperty(),
    class_validator_1.IsAlpha(),
    __metadata("design:type", String)
], UserDto.prototype, "firstName", void 0);
__decorate([
    class_transformer_1.Expose(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    swagger_1.ApiProperty(),
    class_validator_1.IsAlpha(),
    __metadata("design:type", String)
], UserDto.prototype, "lastName", void 0);
__decorate([
    swagger_1.ApiProperty(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    __metadata("design:type", String)
], UserDto.prototype, "password", void 0);
__decorate([
    class_transformer_1.Expose(),
    swagger_1.ApiProperty(),
    class_validator_1.IsEmail(),
    class_validator_1.MaxLength(constants_1.columnSize.length64),
    __metadata("design:type", String)
], UserDto.prototype, "email", void 0);
exports.UserDto = UserDto;


/***/ }),

/***/ "./src/users/models/user.entity.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const typegoose_1 = __webpack_require__("@typegoose/typegoose");
const bcrypt_1 = __webpack_require__("bcrypt");
const constants_1 = __webpack_require__("./src/shared/constants.ts");
const base_entity_1 = __webpack_require__("./src/shared/models/base.entity.ts");
const class_transformer_1 = __webpack_require__("class-transformer");
let User = class User extends base_entity_1.BaseEntity {
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { firstName: { required: true, type: () => String }, lastName: { required: true, type: () => String }, email: { required: true, type: () => String }, password: { required: true, type: () => String } };
    }
};
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        text: true,
        unique: false,
    }),
    __metadata("design:type", String)
], User.prototype, "firstName", void 0);
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        text: true,
        unique: false,
    }),
    __metadata("design:type", String)
], User.prototype, "lastName", void 0);
__decorate([
    typegoose_1.prop({
        required: true,
        maxlength: constants_1.columnSize.length64,
        trim: true,
        lowercase: true,
        text: true,
        unique: true,
    }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    typegoose_1.prop({ required: true, maxlength: constants_1.columnSize.length64 }),
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    typegoose_1.pre('save', async function () {
        try {
            this.password = await bcrypt_1.hash(this.password, 10);
        }
        catch (e) {
            throw new common_1.InternalServerErrorException(e);
        }
    })
], User);
exports.User = User;


/***/ }),

/***/ "./src/users/users.controller.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const openapi = __webpack_require__("@nestjs/swagger");
const common_1 = __webpack_require__("@nestjs/common");
const swagger_1 = __webpack_require__("@nestjs/swagger");
const base_controller_1 = __webpack_require__("./src/shared/base.controller.ts");
const create_user_dto_1 = __webpack_require__("./src/users/models/dto/create-user.dto.ts");
const user_dto_1 = __webpack_require__("./src/users/models/dto/user.dto.ts");
const users_service_1 = __webpack_require__("./src/users/users.service.ts");
const user_entity_1 = __webpack_require__("./src/users/models/user.entity.ts");
let UsersController = class UsersController extends base_controller_1.AbstractCrudController({
    entity: user_entity_1.User,
    entityDto: user_dto_1.UserDto,
    createDto: create_user_dto_1.CreateUserDto,
}) {
    constructor(usersService) {
        super(usersService);
        this.usersService = usersService;
    }
};
UsersController = __decorate([
    swagger_1.ApiTags('Users'),
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;


/***/ }),

/***/ "./src/users/users.module.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const users_service_1 = __webpack_require__("./src/users/users.service.ts");
const users_controller_1 = __webpack_require__("./src/users/users.controller.ts");
const user_entity_1 = __webpack_require__("./src/users/models/user.entity.ts");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let UsersModule = class UsersModule {
};
UsersModule = __decorate([
    common_1.Module({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: user_entity_1.User.modelName, schema: user_entity_1.User.schema }]),
        ],
        providers: [users_service_1.UsersService],
        controllers: [users_controller_1.UsersController],
        exports: [users_service_1.UsersService],
    })
], UsersModule);
exports.UsersModule = UsersModule;


/***/ }),

/***/ "./src/users/users.service.ts":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = __webpack_require__("@nestjs/common");
const base_service_1 = __webpack_require__("./src/shared/base.service.ts");
const user_entity_1 = __webpack_require__("./src/users/models/user.entity.ts");
const mongoose_1 = __webpack_require__("@nestjs/mongoose");
let UsersService = class UsersService extends base_service_1.BaseService {
    constructor(userEntity) {
        super(userEntity);
        this.userEntity = userEntity;
    }
};
UsersService = __decorate([
    common_1.Injectable(),
    __param(0, mongoose_1.InjectModel(user_entity_1.User.modelName)),
    __metadata("design:paramtypes", [Object])
], UsersService);
exports.UsersService = UsersService;


/***/ }),

/***/ 0:
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__("./node_modules/webpack/hot/poll.js?100");
module.exports = __webpack_require__("./src/main.ts");


/***/ }),

/***/ "@nestjs/common":
/***/ (function(module, exports) {

module.exports = require("@nestjs/common");

/***/ }),

/***/ "@nestjs/core":
/***/ (function(module, exports) {

module.exports = require("@nestjs/core");

/***/ }),

/***/ "@nestjs/jwt":
/***/ (function(module, exports) {

module.exports = require("@nestjs/jwt");

/***/ }),

/***/ "@nestjs/mongoose":
/***/ (function(module, exports) {

module.exports = require("@nestjs/mongoose");

/***/ }),

/***/ "@nestjs/passport":
/***/ (function(module, exports) {

module.exports = require("@nestjs/passport");

/***/ }),

/***/ "@nestjs/swagger":
/***/ (function(module, exports) {

module.exports = require("@nestjs/swagger");

/***/ }),

/***/ "@typegoose/typegoose":
/***/ (function(module, exports) {

module.exports = require("@typegoose/typegoose");

/***/ }),

/***/ "@typegoose/typegoose/lib/defaultClasses":
/***/ (function(module, exports) {

module.exports = require("@typegoose/typegoose/lib/defaultClasses");

/***/ }),

/***/ "bcrypt":
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "class-transformer":
/***/ (function(module, exports) {

module.exports = require("class-transformer");

/***/ }),

/***/ "class-validator":
/***/ (function(module, exports) {

module.exports = require("class-validator");

/***/ }),

/***/ "compression":
/***/ (function(module, exports) {

module.exports = require("compression");

/***/ }),

/***/ "express-rate-limit":
/***/ (function(module, exports) {

module.exports = require("express-rate-limit");

/***/ }),

/***/ "helmet":
/***/ (function(module, exports) {

module.exports = require("helmet");

/***/ }),

/***/ "mongoose":
/***/ (function(module, exports) {

module.exports = require("mongoose");

/***/ }),

/***/ "passport-jwt":
/***/ (function(module, exports) {

module.exports = require("passport-jwt");

/***/ }),

/***/ "passport-local":
/***/ (function(module, exports) {

module.exports = require("passport-local");

/***/ })

/******/ });