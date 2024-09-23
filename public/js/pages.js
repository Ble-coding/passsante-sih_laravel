/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js":
/*!***************************************************************!*\
  !*** ./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FrameElement: () => (/* binding */ FrameElement),
/* harmony export */   FrameLoadingStyle: () => (/* binding */ FrameLoadingStyle),
/* harmony export */   FrameRenderer: () => (/* binding */ FrameRenderer),
/* harmony export */   PageRenderer: () => (/* binding */ PageRenderer),
/* harmony export */   PageSnapshot: () => (/* binding */ PageSnapshot),
/* harmony export */   StreamActions: () => (/* binding */ StreamActions),
/* harmony export */   StreamElement: () => (/* binding */ StreamElement),
/* harmony export */   StreamSourceElement: () => (/* binding */ StreamSourceElement),
/* harmony export */   cache: () => (/* binding */ cache),
/* harmony export */   clearCache: () => (/* binding */ clearCache),
/* harmony export */   connectStreamSource: () => (/* binding */ connectStreamSource),
/* harmony export */   disconnectStreamSource: () => (/* binding */ disconnectStreamSource),
/* harmony export */   navigator: () => (/* binding */ navigator$1),
/* harmony export */   registerAdapter: () => (/* binding */ registerAdapter),
/* harmony export */   renderStreamMessage: () => (/* binding */ renderStreamMessage),
/* harmony export */   session: () => (/* binding */ session),
/* harmony export */   setConfirmMethod: () => (/* binding */ setConfirmMethod),
/* harmony export */   setFormMode: () => (/* binding */ setFormMode),
/* harmony export */   setProgressBarDelay: () => (/* binding */ setProgressBarDelay),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   visit: () => (/* binding */ visit)
/* harmony export */ });
/*
Turbo 7.3.0
Copyright © 2023 37signals LLC
 */
(function () {
    if (window.Reflect === undefined ||
        window.customElements === undefined ||
        window.customElements.polyfillWrapFlushCallback) {
        return;
    }
    const BuiltInHTMLElement = HTMLElement;
    const wrapperForTheName = {
        HTMLElement: function HTMLElement() {
            return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
        },
    };
    window.HTMLElement = wrapperForTheName["HTMLElement"];
    HTMLElement.prototype = BuiltInHTMLElement.prototype;
    HTMLElement.prototype.constructor = HTMLElement;
    Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})();

/**
 * The MIT License (MIT)
 * 
 * Copyright (c) 2019 Javan Makhmali
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function(prototype) {
  if (typeof prototype.requestSubmit == "function") return

  prototype.requestSubmit = function(submitter) {
    if (submitter) {
      validateSubmitter(submitter, this);
      submitter.click();
    } else {
      submitter = document.createElement("input");
      submitter.type = "submit";
      submitter.hidden = true;
      this.appendChild(submitter);
      submitter.click();
      this.removeChild(submitter);
    }
  };

  function validateSubmitter(submitter, form) {
    submitter instanceof HTMLElement || raise(TypeError, "parameter 1 is not of type 'HTMLElement'");
    submitter.type == "submit" || raise(TypeError, "The specified element is not a submit button");
    submitter.form == form || raise(DOMException, "The specified element is not owned by this form element", "NotFoundError");
  }

  function raise(errorConstructor, message, name) {
    throw new errorConstructor("Failed to execute 'requestSubmit' on 'HTMLFormElement': " + message + ".", name)
  }
})(HTMLFormElement.prototype);

const submittersByForm = new WeakMap();
function findSubmitterFromClickTarget(target) {
    const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
    const candidate = element ? element.closest("input, button") : null;
    return (candidate === null || candidate === void 0 ? void 0 : candidate.type) == "submit" ? candidate : null;
}
function clickCaptured(event) {
    const submitter = findSubmitterFromClickTarget(event.target);
    if (submitter && submitter.form) {
        submittersByForm.set(submitter.form, submitter);
    }
}
(function () {
    if ("submitter" in Event.prototype)
        return;
    let prototype = window.Event.prototype;
    if ("SubmitEvent" in window && /Apple Computer/.test(navigator.vendor)) {
        prototype = window.SubmitEvent.prototype;
    }
    else if ("SubmitEvent" in window) {
        return;
    }
    addEventListener("click", clickCaptured, true);
    Object.defineProperty(prototype, "submitter", {
        get() {
            if (this.type == "submit" && this.target instanceof HTMLFormElement) {
                return submittersByForm.get(this.target);
            }
        },
    });
})();

var FrameLoadingStyle;
(function (FrameLoadingStyle) {
    FrameLoadingStyle["eager"] = "eager";
    FrameLoadingStyle["lazy"] = "lazy";
})(FrameLoadingStyle || (FrameLoadingStyle = {}));
class FrameElement extends HTMLElement {
    static get observedAttributes() {
        return ["disabled", "complete", "loading", "src"];
    }
    constructor() {
        super();
        this.loaded = Promise.resolve();
        this.delegate = new FrameElement.delegateConstructor(this);
    }
    connectedCallback() {
        this.delegate.connect();
    }
    disconnectedCallback() {
        this.delegate.disconnect();
    }
    reload() {
        return this.delegate.sourceURLReloaded();
    }
    attributeChangedCallback(name) {
        if (name == "loading") {
            this.delegate.loadingStyleChanged();
        }
        else if (name == "complete") {
            this.delegate.completeChanged();
        }
        else if (name == "src") {
            this.delegate.sourceURLChanged();
        }
        else {
            this.delegate.disabledChanged();
        }
    }
    get src() {
        return this.getAttribute("src");
    }
    set src(value) {
        if (value) {
            this.setAttribute("src", value);
        }
        else {
            this.removeAttribute("src");
        }
    }
    get loading() {
        return frameLoadingStyleFromString(this.getAttribute("loading") || "");
    }
    set loading(value) {
        if (value) {
            this.setAttribute("loading", value);
        }
        else {
            this.removeAttribute("loading");
        }
    }
    get disabled() {
        return this.hasAttribute("disabled");
    }
    set disabled(value) {
        if (value) {
            this.setAttribute("disabled", "");
        }
        else {
            this.removeAttribute("disabled");
        }
    }
    get autoscroll() {
        return this.hasAttribute("autoscroll");
    }
    set autoscroll(value) {
        if (value) {
            this.setAttribute("autoscroll", "");
        }
        else {
            this.removeAttribute("autoscroll");
        }
    }
    get complete() {
        return !this.delegate.isLoading;
    }
    get isActive() {
        return this.ownerDocument === document && !this.isPreview;
    }
    get isPreview() {
        var _a, _b;
        return (_b = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.documentElement) === null || _b === void 0 ? void 0 : _b.hasAttribute("data-turbo-preview");
    }
}
function frameLoadingStyleFromString(style) {
    switch (style.toLowerCase()) {
        case "lazy":
            return FrameLoadingStyle.lazy;
        default:
            return FrameLoadingStyle.eager;
    }
}

function expandURL(locatable) {
    return new URL(locatable.toString(), document.baseURI);
}
function getAnchor(url) {
    let anchorMatch;
    if (url.hash) {
        return url.hash.slice(1);
    }
    else if ((anchorMatch = url.href.match(/#(.*)$/))) {
        return anchorMatch[1];
    }
}
function getAction(form, submitter) {
    const action = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formaction")) || form.getAttribute("action") || form.action;
    return expandURL(action);
}
function getExtension(url) {
    return (getLastPathComponent(url).match(/\.[^.]*$/) || [])[0] || "";
}
function isHTML(url) {
    return !!getExtension(url).match(/^(?:|\.(?:htm|html|xhtml|php))$/);
}
function isPrefixedBy(baseURL, url) {
    const prefix = getPrefix(url);
    return baseURL.href === expandURL(prefix).href || baseURL.href.startsWith(prefix);
}
function locationIsVisitable(location, rootLocation) {
    return isPrefixedBy(location, rootLocation) && isHTML(location);
}
function getRequestURL(url) {
    const anchor = getAnchor(url);
    return anchor != null ? url.href.slice(0, -(anchor.length + 1)) : url.href;
}
function toCacheKey(url) {
    return getRequestURL(url);
}
function urlsAreEqual(left, right) {
    return expandURL(left).href == expandURL(right).href;
}
function getPathComponents(url) {
    return url.pathname.split("/").slice(1);
}
function getLastPathComponent(url) {
    return getPathComponents(url).slice(-1)[0];
}
function getPrefix(url) {
    return addTrailingSlash(url.origin + url.pathname);
}
function addTrailingSlash(value) {
    return value.endsWith("/") ? value : value + "/";
}

class FetchResponse {
    constructor(response) {
        this.response = response;
    }
    get succeeded() {
        return this.response.ok;
    }
    get failed() {
        return !this.succeeded;
    }
    get clientError() {
        return this.statusCode >= 400 && this.statusCode <= 499;
    }
    get serverError() {
        return this.statusCode >= 500 && this.statusCode <= 599;
    }
    get redirected() {
        return this.response.redirected;
    }
    get location() {
        return expandURL(this.response.url);
    }
    get isHTML() {
        return this.contentType && this.contentType.match(/^(?:text\/([^\s;,]+\b)?html|application\/xhtml\+xml)\b/);
    }
    get statusCode() {
        return this.response.status;
    }
    get contentType() {
        return this.header("Content-Type");
    }
    get responseText() {
        return this.response.clone().text();
    }
    get responseHTML() {
        if (this.isHTML) {
            return this.response.clone().text();
        }
        else {
            return Promise.resolve(undefined);
        }
    }
    header(name) {
        return this.response.headers.get(name);
    }
}

function activateScriptElement(element) {
    if (element.getAttribute("data-turbo-eval") == "false") {
        return element;
    }
    else {
        const createdScriptElement = document.createElement("script");
        const cspNonce = getMetaContent("csp-nonce");
        if (cspNonce) {
            createdScriptElement.nonce = cspNonce;
        }
        createdScriptElement.textContent = element.textContent;
        createdScriptElement.async = false;
        copyElementAttributes(createdScriptElement, element);
        return createdScriptElement;
    }
}
function copyElementAttributes(destinationElement, sourceElement) {
    for (const { name, value } of sourceElement.attributes) {
        destinationElement.setAttribute(name, value);
    }
}
function createDocumentFragment(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content;
}
function dispatch(eventName, { target, cancelable, detail } = {}) {
    const event = new CustomEvent(eventName, {
        cancelable,
        bubbles: true,
        composed: true,
        detail,
    });
    if (target && target.isConnected) {
        target.dispatchEvent(event);
    }
    else {
        document.documentElement.dispatchEvent(event);
    }
    return event;
}
function nextAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
function nextEventLoopTick() {
    return new Promise((resolve) => setTimeout(() => resolve(), 0));
}
function nextMicrotask() {
    return Promise.resolve();
}
function parseHTMLDocument(html = "") {
    return new DOMParser().parseFromString(html, "text/html");
}
function unindent(strings, ...values) {
    const lines = interpolate(strings, values).replace(/^\n/, "").split("\n");
    const match = lines[0].match(/^\s+/);
    const indent = match ? match[0].length : 0;
    return lines.map((line) => line.slice(indent)).join("\n");
}
function interpolate(strings, values) {
    return strings.reduce((result, string, i) => {
        const value = values[i] == undefined ? "" : values[i];
        return result + string + value;
    }, "");
}
function uuid() {
    return Array.from({ length: 36 })
        .map((_, i) => {
        if (i == 8 || i == 13 || i == 18 || i == 23) {
            return "-";
        }
        else if (i == 14) {
            return "4";
        }
        else if (i == 19) {
            return (Math.floor(Math.random() * 4) + 8).toString(16);
        }
        else {
            return Math.floor(Math.random() * 15).toString(16);
        }
    })
        .join("");
}
function getAttribute(attributeName, ...elements) {
    for (const value of elements.map((element) => element === null || element === void 0 ? void 0 : element.getAttribute(attributeName))) {
        if (typeof value == "string")
            return value;
    }
    return null;
}
function hasAttribute(attributeName, ...elements) {
    return elements.some((element) => element && element.hasAttribute(attributeName));
}
function markAsBusy(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.setAttribute("busy", "");
        }
        element.setAttribute("aria-busy", "true");
    }
}
function clearBusyState(...elements) {
    for (const element of elements) {
        if (element.localName == "turbo-frame") {
            element.removeAttribute("busy");
        }
        element.removeAttribute("aria-busy");
    }
}
function waitForLoad(element, timeoutInMilliseconds = 2000) {
    return new Promise((resolve) => {
        const onComplete = () => {
            element.removeEventListener("error", onComplete);
            element.removeEventListener("load", onComplete);
            resolve();
        };
        element.addEventListener("load", onComplete, { once: true });
        element.addEventListener("error", onComplete, { once: true });
        setTimeout(resolve, timeoutInMilliseconds);
    });
}
function getHistoryMethodForAction(action) {
    switch (action) {
        case "replace":
            return history.replaceState;
        case "advance":
        case "restore":
            return history.pushState;
    }
}
function isAction(action) {
    return action == "advance" || action == "replace" || action == "restore";
}
function getVisitAction(...elements) {
    const action = getAttribute("data-turbo-action", ...elements);
    return isAction(action) ? action : null;
}
function getMetaElement(name) {
    return document.querySelector(`meta[name="${name}"]`);
}
function getMetaContent(name) {
    const element = getMetaElement(name);
    return element && element.content;
}
function setMetaContent(name, content) {
    let element = getMetaElement(name);
    if (!element) {
        element = document.createElement("meta");
        element.setAttribute("name", name);
        document.head.appendChild(element);
    }
    element.setAttribute("content", content);
    return element;
}
function findClosestRecursively(element, selector) {
    var _a;
    if (element instanceof Element) {
        return (element.closest(selector) ||
            findClosestRecursively(element.assignedSlot || ((_a = element.getRootNode()) === null || _a === void 0 ? void 0 : _a.host), selector));
    }
}

var FetchMethod;
(function (FetchMethod) {
    FetchMethod[FetchMethod["get"] = 0] = "get";
    FetchMethod[FetchMethod["post"] = 1] = "post";
    FetchMethod[FetchMethod["put"] = 2] = "put";
    FetchMethod[FetchMethod["patch"] = 3] = "patch";
    FetchMethod[FetchMethod["delete"] = 4] = "delete";
})(FetchMethod || (FetchMethod = {}));
function fetchMethodFromString(method) {
    switch (method.toLowerCase()) {
        case "get":
            return FetchMethod.get;
        case "post":
            return FetchMethod.post;
        case "put":
            return FetchMethod.put;
        case "patch":
            return FetchMethod.patch;
        case "delete":
            return FetchMethod.delete;
    }
}
class FetchRequest {
    constructor(delegate, method, location, body = new URLSearchParams(), target = null) {
        this.abortController = new AbortController();
        this.resolveRequestPromise = (_value) => { };
        this.delegate = delegate;
        this.method = method;
        this.headers = this.defaultHeaders;
        this.body = body;
        this.url = location;
        this.target = target;
    }
    get location() {
        return this.url;
    }
    get params() {
        return this.url.searchParams;
    }
    get entries() {
        return this.body ? Array.from(this.body.entries()) : [];
    }
    cancel() {
        this.abortController.abort();
    }
    async perform() {
        const { fetchOptions } = this;
        this.delegate.prepareRequest(this);
        await this.allowRequestToBeIntercepted(fetchOptions);
        try {
            this.delegate.requestStarted(this);
            const response = await fetch(this.url.href, fetchOptions);
            return await this.receive(response);
        }
        catch (error) {
            if (error.name !== "AbortError") {
                if (this.willDelegateErrorHandling(error)) {
                    this.delegate.requestErrored(this, error);
                }
                throw error;
            }
        }
        finally {
            this.delegate.requestFinished(this);
        }
    }
    async receive(response) {
        const fetchResponse = new FetchResponse(response);
        const event = dispatch("turbo:before-fetch-response", {
            cancelable: true,
            detail: { fetchResponse },
            target: this.target,
        });
        if (event.defaultPrevented) {
            this.delegate.requestPreventedHandlingResponse(this, fetchResponse);
        }
        else if (fetchResponse.succeeded) {
            this.delegate.requestSucceededWithResponse(this, fetchResponse);
        }
        else {
            this.delegate.requestFailedWithResponse(this, fetchResponse);
        }
        return fetchResponse;
    }
    get fetchOptions() {
        var _a;
        return {
            method: FetchMethod[this.method].toUpperCase(),
            credentials: "same-origin",
            headers: this.headers,
            redirect: "follow",
            body: this.isSafe ? null : this.body,
            signal: this.abortSignal,
            referrer: (_a = this.delegate.referrer) === null || _a === void 0 ? void 0 : _a.href,
        };
    }
    get defaultHeaders() {
        return {
            Accept: "text/html, application/xhtml+xml",
        };
    }
    get isSafe() {
        return this.method === FetchMethod.get;
    }
    get abortSignal() {
        return this.abortController.signal;
    }
    acceptResponseType(mimeType) {
        this.headers["Accept"] = [mimeType, this.headers["Accept"]].join(", ");
    }
    async allowRequestToBeIntercepted(fetchOptions) {
        const requestInterception = new Promise((resolve) => (this.resolveRequestPromise = resolve));
        const event = dispatch("turbo:before-fetch-request", {
            cancelable: true,
            detail: {
                fetchOptions,
                url: this.url,
                resume: this.resolveRequestPromise,
            },
            target: this.target,
        });
        if (event.defaultPrevented)
            await requestInterception;
    }
    willDelegateErrorHandling(error) {
        const event = dispatch("turbo:fetch-request-error", {
            target: this.target,
            cancelable: true,
            detail: { request: this, error: error },
        });
        return !event.defaultPrevented;
    }
}

class AppearanceObserver {
    constructor(delegate, element) {
        this.started = false;
        this.intersect = (entries) => {
            const lastEntry = entries.slice(-1)[0];
            if (lastEntry === null || lastEntry === void 0 ? void 0 : lastEntry.isIntersecting) {
                this.delegate.elementAppearedInViewport(this.element);
            }
        };
        this.delegate = delegate;
        this.element = element;
        this.intersectionObserver = new IntersectionObserver(this.intersect);
    }
    start() {
        if (!this.started) {
            this.started = true;
            this.intersectionObserver.observe(this.element);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            this.intersectionObserver.unobserve(this.element);
        }
    }
}

class StreamMessage {
    static wrap(message) {
        if (typeof message == "string") {
            return new this(createDocumentFragment(message));
        }
        else {
            return message;
        }
    }
    constructor(fragment) {
        this.fragment = importStreamElements(fragment);
    }
}
StreamMessage.contentType = "text/vnd.turbo-stream.html";
function importStreamElements(fragment) {
    for (const element of fragment.querySelectorAll("turbo-stream")) {
        const streamElement = document.importNode(element, true);
        for (const inertScriptElement of streamElement.templateElement.content.querySelectorAll("script")) {
            inertScriptElement.replaceWith(activateScriptElement(inertScriptElement));
        }
        element.replaceWith(streamElement);
    }
    return fragment;
}

var FormSubmissionState;
(function (FormSubmissionState) {
    FormSubmissionState[FormSubmissionState["initialized"] = 0] = "initialized";
    FormSubmissionState[FormSubmissionState["requesting"] = 1] = "requesting";
    FormSubmissionState[FormSubmissionState["waiting"] = 2] = "waiting";
    FormSubmissionState[FormSubmissionState["receiving"] = 3] = "receiving";
    FormSubmissionState[FormSubmissionState["stopping"] = 4] = "stopping";
    FormSubmissionState[FormSubmissionState["stopped"] = 5] = "stopped";
})(FormSubmissionState || (FormSubmissionState = {}));
var FormEnctype;
(function (FormEnctype) {
    FormEnctype["urlEncoded"] = "application/x-www-form-urlencoded";
    FormEnctype["multipart"] = "multipart/form-data";
    FormEnctype["plain"] = "text/plain";
})(FormEnctype || (FormEnctype = {}));
function formEnctypeFromString(encoding) {
    switch (encoding.toLowerCase()) {
        case FormEnctype.multipart:
            return FormEnctype.multipart;
        case FormEnctype.plain:
            return FormEnctype.plain;
        default:
            return FormEnctype.urlEncoded;
    }
}
class FormSubmission {
    static confirmMethod(message, _element, _submitter) {
        return Promise.resolve(confirm(message));
    }
    constructor(delegate, formElement, submitter, mustRedirect = false) {
        this.state = FormSubmissionState.initialized;
        this.delegate = delegate;
        this.formElement = formElement;
        this.submitter = submitter;
        this.formData = buildFormData(formElement, submitter);
        this.location = expandURL(this.action);
        if (this.method == FetchMethod.get) {
            mergeFormDataEntries(this.location, [...this.body.entries()]);
        }
        this.fetchRequest = new FetchRequest(this, this.method, this.location, this.body, this.formElement);
        this.mustRedirect = mustRedirect;
    }
    get method() {
        var _a;
        const method = ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formmethod")) || this.formElement.getAttribute("method") || "";
        return fetchMethodFromString(method.toLowerCase()) || FetchMethod.get;
    }
    get action() {
        var _a;
        const formElementAction = typeof this.formElement.action === "string" ? this.formElement.action : null;
        if ((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.hasAttribute("formaction")) {
            return this.submitter.getAttribute("formaction") || "";
        }
        else {
            return this.formElement.getAttribute("action") || formElementAction || "";
        }
    }
    get body() {
        if (this.enctype == FormEnctype.urlEncoded || this.method == FetchMethod.get) {
            return new URLSearchParams(this.stringFormData);
        }
        else {
            return this.formData;
        }
    }
    get enctype() {
        var _a;
        return formEnctypeFromString(((_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("formenctype")) || this.formElement.enctype);
    }
    get isSafe() {
        return this.fetchRequest.isSafe;
    }
    get stringFormData() {
        return [...this.formData].reduce((entries, [name, value]) => {
            return entries.concat(typeof value == "string" ? [[name, value]] : []);
        }, []);
    }
    async start() {
        const { initialized, requesting } = FormSubmissionState;
        const confirmationMessage = getAttribute("data-turbo-confirm", this.submitter, this.formElement);
        if (typeof confirmationMessage === "string") {
            const answer = await FormSubmission.confirmMethod(confirmationMessage, this.formElement, this.submitter);
            if (!answer) {
                return;
            }
        }
        if (this.state == initialized) {
            this.state = requesting;
            return this.fetchRequest.perform();
        }
    }
    stop() {
        const { stopping, stopped } = FormSubmissionState;
        if (this.state != stopping && this.state != stopped) {
            this.state = stopping;
            this.fetchRequest.cancel();
            return true;
        }
    }
    prepareRequest(request) {
        if (!request.isSafe) {
            const token = getCookieValue(getMetaContent("csrf-param")) || getMetaContent("csrf-token");
            if (token) {
                request.headers["X-CSRF-Token"] = token;
            }
        }
        if (this.requestAcceptsTurboStreamResponse(request)) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        var _a;
        this.state = FormSubmissionState.waiting;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.setAttribute("disabled", "");
        this.setSubmitsWith();
        dispatch("turbo:submit-start", {
            target: this.formElement,
            detail: { formSubmission: this },
        });
        this.delegate.formSubmissionStarted(this);
    }
    requestPreventedHandlingResponse(request, response) {
        this.result = { success: response.succeeded, fetchResponse: response };
    }
    requestSucceededWithResponse(request, response) {
        if (response.clientError || response.serverError) {
            this.delegate.formSubmissionFailedWithResponse(this, response);
        }
        else if (this.requestMustRedirect(request) && responseSucceededWithoutRedirect(response)) {
            const error = new Error("Form responses must redirect to another location");
            this.delegate.formSubmissionErrored(this, error);
        }
        else {
            this.state = FormSubmissionState.receiving;
            this.result = { success: true, fetchResponse: response };
            this.delegate.formSubmissionSucceededWithResponse(this, response);
        }
    }
    requestFailedWithResponse(request, response) {
        this.result = { success: false, fetchResponse: response };
        this.delegate.formSubmissionFailedWithResponse(this, response);
    }
    requestErrored(request, error) {
        this.result = { success: false, error };
        this.delegate.formSubmissionErrored(this, error);
    }
    requestFinished(_request) {
        var _a;
        this.state = FormSubmissionState.stopped;
        (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.removeAttribute("disabled");
        this.resetSubmitterText();
        dispatch("turbo:submit-end", {
            target: this.formElement,
            detail: Object.assign({ formSubmission: this }, this.result),
        });
        this.delegate.formSubmissionFinished(this);
    }
    setSubmitsWith() {
        if (!this.submitter || !this.submitsWith)
            return;
        if (this.submitter.matches("button")) {
            this.originalSubmitText = this.submitter.innerHTML;
            this.submitter.innerHTML = this.submitsWith;
        }
        else if (this.submitter.matches("input")) {
            const input = this.submitter;
            this.originalSubmitText = input.value;
            input.value = this.submitsWith;
        }
    }
    resetSubmitterText() {
        if (!this.submitter || !this.originalSubmitText)
            return;
        if (this.submitter.matches("button")) {
            this.submitter.innerHTML = this.originalSubmitText;
        }
        else if (this.submitter.matches("input")) {
            const input = this.submitter;
            input.value = this.originalSubmitText;
        }
    }
    requestMustRedirect(request) {
        return !request.isSafe && this.mustRedirect;
    }
    requestAcceptsTurboStreamResponse(request) {
        return !request.isSafe || hasAttribute("data-turbo-stream", this.submitter, this.formElement);
    }
    get submitsWith() {
        var _a;
        return (_a = this.submitter) === null || _a === void 0 ? void 0 : _a.getAttribute("data-turbo-submits-with");
    }
}
function buildFormData(formElement, submitter) {
    const formData = new FormData(formElement);
    const name = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("name");
    const value = submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("value");
    if (name) {
        formData.append(name, value || "");
    }
    return formData;
}
function getCookieValue(cookieName) {
    if (cookieName != null) {
        const cookies = document.cookie ? document.cookie.split("; ") : [];
        const cookie = cookies.find((cookie) => cookie.startsWith(cookieName));
        if (cookie) {
            const value = cookie.split("=").slice(1).join("=");
            return value ? decodeURIComponent(value) : undefined;
        }
    }
}
function responseSucceededWithoutRedirect(response) {
    return response.statusCode == 200 && !response.redirected;
}
function mergeFormDataEntries(url, entries) {
    const searchParams = new URLSearchParams();
    for (const [name, value] of entries) {
        if (value instanceof File)
            continue;
        searchParams.append(name, value);
    }
    url.search = searchParams.toString();
    return url;
}

class Snapshot {
    constructor(element) {
        this.element = element;
    }
    get activeElement() {
        return this.element.ownerDocument.activeElement;
    }
    get children() {
        return [...this.element.children];
    }
    hasAnchor(anchor) {
        return this.getElementForAnchor(anchor) != null;
    }
    getElementForAnchor(anchor) {
        return anchor ? this.element.querySelector(`[id='${anchor}'], a[name='${anchor}']`) : null;
    }
    get isConnected() {
        return this.element.isConnected;
    }
    get firstAutofocusableElement() {
        const inertDisabledOrHidden = "[inert], :disabled, [hidden], details:not([open]), dialog:not([open])";
        for (const element of this.element.querySelectorAll("[autofocus]")) {
            if (element.closest(inertDisabledOrHidden) == null)
                return element;
            else
                continue;
        }
        return null;
    }
    get permanentElements() {
        return queryPermanentElementsAll(this.element);
    }
    getPermanentElementById(id) {
        return getPermanentElementById(this.element, id);
    }
    getPermanentElementMapForSnapshot(snapshot) {
        const permanentElementMap = {};
        for (const currentPermanentElement of this.permanentElements) {
            const { id } = currentPermanentElement;
            const newPermanentElement = snapshot.getPermanentElementById(id);
            if (newPermanentElement) {
                permanentElementMap[id] = [currentPermanentElement, newPermanentElement];
            }
        }
        return permanentElementMap;
    }
}
function getPermanentElementById(node, id) {
    return node.querySelector(`#${id}[data-turbo-permanent]`);
}
function queryPermanentElementsAll(node) {
    return node.querySelectorAll("[id][data-turbo-permanent]");
}

class FormSubmitObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.submitCaptured = () => {
            this.eventTarget.removeEventListener("submit", this.submitBubbled, false);
            this.eventTarget.addEventListener("submit", this.submitBubbled, false);
        };
        this.submitBubbled = ((event) => {
            if (!event.defaultPrevented) {
                const form = event.target instanceof HTMLFormElement ? event.target : undefined;
                const submitter = event.submitter || undefined;
                if (form &&
                    submissionDoesNotDismissDialog(form, submitter) &&
                    submissionDoesNotTargetIFrame(form, submitter) &&
                    this.delegate.willSubmitForm(form, submitter)) {
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    this.delegate.formSubmitted(form, submitter);
                }
            }
        });
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("submit", this.submitCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("submit", this.submitCaptured, true);
            this.started = false;
        }
    }
}
function submissionDoesNotDismissDialog(form, submitter) {
    const method = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formmethod")) || form.getAttribute("method");
    return method != "dialog";
}
function submissionDoesNotTargetIFrame(form, submitter) {
    if ((submitter === null || submitter === void 0 ? void 0 : submitter.hasAttribute("formtarget")) || form.hasAttribute("target")) {
        const target = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("formtarget")) || form.target;
        for (const element of document.getElementsByName(target)) {
            if (element instanceof HTMLIFrameElement)
                return false;
        }
        return true;
    }
    else {
        return true;
    }
}

class View {
    constructor(delegate, element) {
        this.resolveRenderPromise = (_value) => { };
        this.resolveInterceptionPromise = (_value) => { };
        this.delegate = delegate;
        this.element = element;
    }
    scrollToAnchor(anchor) {
        const element = this.snapshot.getElementForAnchor(anchor);
        if (element) {
            this.scrollToElement(element);
            this.focusElement(element);
        }
        else {
            this.scrollToPosition({ x: 0, y: 0 });
        }
    }
    scrollToAnchorFromLocation(location) {
        this.scrollToAnchor(getAnchor(location));
    }
    scrollToElement(element) {
        element.scrollIntoView();
    }
    focusElement(element) {
        if (element instanceof HTMLElement) {
            if (element.hasAttribute("tabindex")) {
                element.focus();
            }
            else {
                element.setAttribute("tabindex", "-1");
                element.focus();
                element.removeAttribute("tabindex");
            }
        }
    }
    scrollToPosition({ x, y }) {
        this.scrollRoot.scrollTo(x, y);
    }
    scrollToTop() {
        this.scrollToPosition({ x: 0, y: 0 });
    }
    get scrollRoot() {
        return window;
    }
    async render(renderer) {
        const { isPreview, shouldRender, newSnapshot: snapshot } = renderer;
        if (shouldRender) {
            try {
                this.renderPromise = new Promise((resolve) => (this.resolveRenderPromise = resolve));
                this.renderer = renderer;
                await this.prepareToRenderSnapshot(renderer);
                const renderInterception = new Promise((resolve) => (this.resolveInterceptionPromise = resolve));
                const options = { resume: this.resolveInterceptionPromise, render: this.renderer.renderElement };
                const immediateRender = this.delegate.allowsImmediateRender(snapshot, options);
                if (!immediateRender)
                    await renderInterception;
                await this.renderSnapshot(renderer);
                this.delegate.viewRenderedSnapshot(snapshot, isPreview);
                this.delegate.preloadOnLoadLinksForView(this.element);
                this.finishRenderingSnapshot(renderer);
            }
            finally {
                delete this.renderer;
                this.resolveRenderPromise(undefined);
                delete this.renderPromise;
            }
        }
        else {
            this.invalidate(renderer.reloadReason);
        }
    }
    invalidate(reason) {
        this.delegate.viewInvalidated(reason);
    }
    async prepareToRenderSnapshot(renderer) {
        this.markAsPreview(renderer.isPreview);
        await renderer.prepareToRender();
    }
    markAsPreview(isPreview) {
        if (isPreview) {
            this.element.setAttribute("data-turbo-preview", "");
        }
        else {
            this.element.removeAttribute("data-turbo-preview");
        }
    }
    async renderSnapshot(renderer) {
        await renderer.render();
    }
    finishRenderingSnapshot(renderer) {
        renderer.finishRendering();
    }
}

class FrameView extends View {
    missing() {
        this.element.innerHTML = `<strong class="turbo-frame-error">Content missing</strong>`;
    }
    get snapshot() {
        return new Snapshot(this.element);
    }
}

class LinkInterceptor {
    constructor(delegate, element) {
        this.clickBubbled = (event) => {
            if (this.respondsToEventTarget(event.target)) {
                this.clickEvent = event;
            }
            else {
                delete this.clickEvent;
            }
        };
        this.linkClicked = ((event) => {
            if (this.clickEvent && this.respondsToEventTarget(event.target) && event.target instanceof Element) {
                if (this.delegate.shouldInterceptLinkClick(event.target, event.detail.url, event.detail.originalEvent)) {
                    this.clickEvent.preventDefault();
                    event.preventDefault();
                    this.delegate.linkClickIntercepted(event.target, event.detail.url, event.detail.originalEvent);
                }
            }
            delete this.clickEvent;
        });
        this.willVisit = ((_event) => {
            delete this.clickEvent;
        });
        this.delegate = delegate;
        this.element = element;
    }
    start() {
        this.element.addEventListener("click", this.clickBubbled);
        document.addEventListener("turbo:click", this.linkClicked);
        document.addEventListener("turbo:before-visit", this.willVisit);
    }
    stop() {
        this.element.removeEventListener("click", this.clickBubbled);
        document.removeEventListener("turbo:click", this.linkClicked);
        document.removeEventListener("turbo:before-visit", this.willVisit);
    }
    respondsToEventTarget(target) {
        const element = target instanceof Element ? target : target instanceof Node ? target.parentElement : null;
        return element && element.closest("turbo-frame, html") == this.element;
    }
}

class LinkClickObserver {
    constructor(delegate, eventTarget) {
        this.started = false;
        this.clickCaptured = () => {
            this.eventTarget.removeEventListener("click", this.clickBubbled, false);
            this.eventTarget.addEventListener("click", this.clickBubbled, false);
        };
        this.clickBubbled = (event) => {
            if (event instanceof MouseEvent && this.clickEventIsSignificant(event)) {
                const target = (event.composedPath && event.composedPath()[0]) || event.target;
                const link = this.findLinkFromClickTarget(target);
                if (link && doesNotTargetIFrame(link)) {
                    const location = this.getLocationForLink(link);
                    if (this.delegate.willFollowLinkToLocation(link, location, event)) {
                        event.preventDefault();
                        this.delegate.followedLinkToLocation(link, location);
                    }
                }
            }
        };
        this.delegate = delegate;
        this.eventTarget = eventTarget;
    }
    start() {
        if (!this.started) {
            this.eventTarget.addEventListener("click", this.clickCaptured, true);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            this.eventTarget.removeEventListener("click", this.clickCaptured, true);
            this.started = false;
        }
    }
    clickEventIsSignificant(event) {
        return !((event.target && event.target.isContentEditable) ||
            event.defaultPrevented ||
            event.which > 1 ||
            event.altKey ||
            event.ctrlKey ||
            event.metaKey ||
            event.shiftKey);
    }
    findLinkFromClickTarget(target) {
        return findClosestRecursively(target, "a[href]:not([target^=_]):not([download])");
    }
    getLocationForLink(link) {
        return expandURL(link.getAttribute("href") || "");
    }
}
function doesNotTargetIFrame(anchor) {
    if (anchor.hasAttribute("target")) {
        for (const element of document.getElementsByName(anchor.target)) {
            if (element instanceof HTMLIFrameElement)
                return false;
        }
        return true;
    }
    else {
        return true;
    }
}

class FormLinkClickObserver {
    constructor(delegate, element) {
        this.delegate = delegate;
        this.linkInterceptor = new LinkClickObserver(this, element);
    }
    start() {
        this.linkInterceptor.start();
    }
    stop() {
        this.linkInterceptor.stop();
    }
    willFollowLinkToLocation(link, location, originalEvent) {
        return (this.delegate.willSubmitFormLinkToLocation(link, location, originalEvent) &&
            link.hasAttribute("data-turbo-method"));
    }
    followedLinkToLocation(link, location) {
        const form = document.createElement("form");
        const type = "hidden";
        for (const [name, value] of location.searchParams) {
            form.append(Object.assign(document.createElement("input"), { type, name, value }));
        }
        const action = Object.assign(location, { search: "" });
        form.setAttribute("data-turbo", "true");
        form.setAttribute("action", action.href);
        form.setAttribute("hidden", "");
        const method = link.getAttribute("data-turbo-method");
        if (method)
            form.setAttribute("method", method);
        const turboFrame = link.getAttribute("data-turbo-frame");
        if (turboFrame)
            form.setAttribute("data-turbo-frame", turboFrame);
        const turboAction = getVisitAction(link);
        if (turboAction)
            form.setAttribute("data-turbo-action", turboAction);
        const turboConfirm = link.getAttribute("data-turbo-confirm");
        if (turboConfirm)
            form.setAttribute("data-turbo-confirm", turboConfirm);
        const turboStream = link.hasAttribute("data-turbo-stream");
        if (turboStream)
            form.setAttribute("data-turbo-stream", "");
        this.delegate.submittedFormLinkToLocation(link, location, form);
        document.body.appendChild(form);
        form.addEventListener("turbo:submit-end", () => form.remove(), { once: true });
        requestAnimationFrame(() => form.requestSubmit());
    }
}

class Bardo {
    static async preservingPermanentElements(delegate, permanentElementMap, callback) {
        const bardo = new this(delegate, permanentElementMap);
        bardo.enter();
        await callback();
        bardo.leave();
    }
    constructor(delegate, permanentElementMap) {
        this.delegate = delegate;
        this.permanentElementMap = permanentElementMap;
    }
    enter() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement, newPermanentElement] = this.permanentElementMap[id];
            this.delegate.enteringBardo(currentPermanentElement, newPermanentElement);
            this.replaceNewPermanentElementWithPlaceholder(newPermanentElement);
        }
    }
    leave() {
        for (const id in this.permanentElementMap) {
            const [currentPermanentElement] = this.permanentElementMap[id];
            this.replaceCurrentPermanentElementWithClone(currentPermanentElement);
            this.replacePlaceholderWithPermanentElement(currentPermanentElement);
            this.delegate.leavingBardo(currentPermanentElement);
        }
    }
    replaceNewPermanentElementWithPlaceholder(permanentElement) {
        const placeholder = createPlaceholderForPermanentElement(permanentElement);
        permanentElement.replaceWith(placeholder);
    }
    replaceCurrentPermanentElementWithClone(permanentElement) {
        const clone = permanentElement.cloneNode(true);
        permanentElement.replaceWith(clone);
    }
    replacePlaceholderWithPermanentElement(permanentElement) {
        const placeholder = this.getPlaceholderById(permanentElement.id);
        placeholder === null || placeholder === void 0 ? void 0 : placeholder.replaceWith(permanentElement);
    }
    getPlaceholderById(id) {
        return this.placeholders.find((element) => element.content == id);
    }
    get placeholders() {
        return [...document.querySelectorAll("meta[name=turbo-permanent-placeholder][content]")];
    }
}
function createPlaceholderForPermanentElement(permanentElement) {
    const element = document.createElement("meta");
    element.setAttribute("name", "turbo-permanent-placeholder");
    element.setAttribute("content", permanentElement.id);
    return element;
}

class Renderer {
    constructor(currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        this.activeElement = null;
        this.currentSnapshot = currentSnapshot;
        this.newSnapshot = newSnapshot;
        this.isPreview = isPreview;
        this.willRender = willRender;
        this.renderElement = renderElement;
        this.promise = new Promise((resolve, reject) => (this.resolvingFunctions = { resolve, reject }));
    }
    get shouldRender() {
        return true;
    }
    get reloadReason() {
        return;
    }
    prepareToRender() {
        return;
    }
    finishRendering() {
        if (this.resolvingFunctions) {
            this.resolvingFunctions.resolve();
            delete this.resolvingFunctions;
        }
    }
    async preservingPermanentElements(callback) {
        await Bardo.preservingPermanentElements(this, this.permanentElementMap, callback);
    }
    focusFirstAutofocusableElement() {
        const element = this.connectedSnapshot.firstAutofocusableElement;
        if (elementIsFocusable(element)) {
            element.focus();
        }
    }
    enteringBardo(currentPermanentElement) {
        if (this.activeElement)
            return;
        if (currentPermanentElement.contains(this.currentSnapshot.activeElement)) {
            this.activeElement = this.currentSnapshot.activeElement;
        }
    }
    leavingBardo(currentPermanentElement) {
        if (currentPermanentElement.contains(this.activeElement) && this.activeElement instanceof HTMLElement) {
            this.activeElement.focus();
            this.activeElement = null;
        }
    }
    get connectedSnapshot() {
        return this.newSnapshot.isConnected ? this.newSnapshot : this.currentSnapshot;
    }
    get currentElement() {
        return this.currentSnapshot.element;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    get permanentElementMap() {
        return this.currentSnapshot.getPermanentElementMapForSnapshot(this.newSnapshot);
    }
}
function elementIsFocusable(element) {
    return element && typeof element.focus == "function";
}

class FrameRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        var _a;
        const destinationRange = document.createRange();
        destinationRange.selectNodeContents(currentElement);
        destinationRange.deleteContents();
        const frameElement = newElement;
        const sourceRange = (_a = frameElement.ownerDocument) === null || _a === void 0 ? void 0 : _a.createRange();
        if (sourceRange) {
            sourceRange.selectNodeContents(frameElement);
            currentElement.appendChild(sourceRange.extractContents());
        }
    }
    constructor(delegate, currentSnapshot, newSnapshot, renderElement, isPreview, willRender = true) {
        super(currentSnapshot, newSnapshot, renderElement, isPreview, willRender);
        this.delegate = delegate;
    }
    get shouldRender() {
        return true;
    }
    async render() {
        await nextAnimationFrame();
        this.preservingPermanentElements(() => {
            this.loadFrameElement();
        });
        this.scrollFrameIntoView();
        await nextAnimationFrame();
        this.focusFirstAutofocusableElement();
        await nextAnimationFrame();
        this.activateScriptElements();
    }
    loadFrameElement() {
        this.delegate.willRenderFrame(this.currentElement, this.newElement);
        this.renderElement(this.currentElement, this.newElement);
    }
    scrollFrameIntoView() {
        if (this.currentElement.autoscroll || this.newElement.autoscroll) {
            const element = this.currentElement.firstElementChild;
            const block = readScrollLogicalPosition(this.currentElement.getAttribute("data-autoscroll-block"), "end");
            const behavior = readScrollBehavior(this.currentElement.getAttribute("data-autoscroll-behavior"), "auto");
            if (element) {
                element.scrollIntoView({ block, behavior });
                return true;
            }
        }
        return false;
    }
    activateScriptElements() {
        for (const inertScriptElement of this.newScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    get newScriptElements() {
        return this.currentElement.querySelectorAll("script");
    }
}
function readScrollLogicalPosition(value, defaultValue) {
    if (value == "end" || value == "start" || value == "center" || value == "nearest") {
        return value;
    }
    else {
        return defaultValue;
    }
}
function readScrollBehavior(value, defaultValue) {
    if (value == "auto" || value == "smooth") {
        return value;
    }
    else {
        return defaultValue;
    }
}

class ProgressBar {
    static get defaultCSS() {
        return unindent `
      .turbo-progress-bar {
        position: fixed;
        display: block;
        top: 0;
        left: 0;
        height: 3px;
        background: #0076ff;
        z-index: 2147483647;
        transition:
          width ${ProgressBar.animationDuration}ms ease-out,
          opacity ${ProgressBar.animationDuration / 2}ms ${ProgressBar.animationDuration / 2}ms ease-in;
        transform: translate3d(0, 0, 0);
      }
    `;
    }
    constructor() {
        this.hiding = false;
        this.value = 0;
        this.visible = false;
        this.trickle = () => {
            this.setValue(this.value + Math.random() / 100);
        };
        this.stylesheetElement = this.createStylesheetElement();
        this.progressElement = this.createProgressElement();
        this.installStylesheetElement();
        this.setValue(0);
    }
    show() {
        if (!this.visible) {
            this.visible = true;
            this.installProgressElement();
            this.startTrickling();
        }
    }
    hide() {
        if (this.visible && !this.hiding) {
            this.hiding = true;
            this.fadeProgressElement(() => {
                this.uninstallProgressElement();
                this.stopTrickling();
                this.visible = false;
                this.hiding = false;
            });
        }
    }
    setValue(value) {
        this.value = value;
        this.refresh();
    }
    installStylesheetElement() {
        document.head.insertBefore(this.stylesheetElement, document.head.firstChild);
    }
    installProgressElement() {
        this.progressElement.style.width = "0";
        this.progressElement.style.opacity = "1";
        document.documentElement.insertBefore(this.progressElement, document.body);
        this.refresh();
    }
    fadeProgressElement(callback) {
        this.progressElement.style.opacity = "0";
        setTimeout(callback, ProgressBar.animationDuration * 1.5);
    }
    uninstallProgressElement() {
        if (this.progressElement.parentNode) {
            document.documentElement.removeChild(this.progressElement);
        }
    }
    startTrickling() {
        if (!this.trickleInterval) {
            this.trickleInterval = window.setInterval(this.trickle, ProgressBar.animationDuration);
        }
    }
    stopTrickling() {
        window.clearInterval(this.trickleInterval);
        delete this.trickleInterval;
    }
    refresh() {
        requestAnimationFrame(() => {
            this.progressElement.style.width = `${10 + this.value * 90}%`;
        });
    }
    createStylesheetElement() {
        const element = document.createElement("style");
        element.type = "text/css";
        element.textContent = ProgressBar.defaultCSS;
        if (this.cspNonce) {
            element.nonce = this.cspNonce;
        }
        return element;
    }
    createProgressElement() {
        const element = document.createElement("div");
        element.className = "turbo-progress-bar";
        return element;
    }
    get cspNonce() {
        return getMetaContent("csp-nonce");
    }
}
ProgressBar.animationDuration = 300;

class HeadSnapshot extends Snapshot {
    constructor() {
        super(...arguments);
        this.detailsByOuterHTML = this.children
            .filter((element) => !elementIsNoscript(element))
            .map((element) => elementWithoutNonce(element))
            .reduce((result, element) => {
            const { outerHTML } = element;
            const details = outerHTML in result
                ? result[outerHTML]
                : {
                    type: elementType(element),
                    tracked: elementIsTracked(element),
                    elements: [],
                };
            return Object.assign(Object.assign({}, result), { [outerHTML]: Object.assign(Object.assign({}, details), { elements: [...details.elements, element] }) });
        }, {});
    }
    get trackedElementSignature() {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => this.detailsByOuterHTML[outerHTML].tracked)
            .join("");
    }
    getScriptElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("script", snapshot);
    }
    getStylesheetElementsNotInSnapshot(snapshot) {
        return this.getElementsMatchingTypeNotInSnapshot("stylesheet", snapshot);
    }
    getElementsMatchingTypeNotInSnapshot(matchedType, snapshot) {
        return Object.keys(this.detailsByOuterHTML)
            .filter((outerHTML) => !(outerHTML in snapshot.detailsByOuterHTML))
            .map((outerHTML) => this.detailsByOuterHTML[outerHTML])
            .filter(({ type }) => type == matchedType)
            .map(({ elements: [element] }) => element);
    }
    get provisionalElements() {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { type, tracked, elements } = this.detailsByOuterHTML[outerHTML];
            if (type == null && !tracked) {
                return [...result, ...elements];
            }
            else if (elements.length > 1) {
                return [...result, ...elements.slice(1)];
            }
            else {
                return result;
            }
        }, []);
    }
    getMetaValue(name) {
        const element = this.findMetaElementByName(name);
        return element ? element.getAttribute("content") : null;
    }
    findMetaElementByName(name) {
        return Object.keys(this.detailsByOuterHTML).reduce((result, outerHTML) => {
            const { elements: [element], } = this.detailsByOuterHTML[outerHTML];
            return elementIsMetaElementWithName(element, name) ? element : result;
        }, undefined);
    }
}
function elementType(element) {
    if (elementIsScript(element)) {
        return "script";
    }
    else if (elementIsStylesheet(element)) {
        return "stylesheet";
    }
}
function elementIsTracked(element) {
    return element.getAttribute("data-turbo-track") == "reload";
}
function elementIsScript(element) {
    const tagName = element.localName;
    return tagName == "script";
}
function elementIsNoscript(element) {
    const tagName = element.localName;
    return tagName == "noscript";
}
function elementIsStylesheet(element) {
    const tagName = element.localName;
    return tagName == "style" || (tagName == "link" && element.getAttribute("rel") == "stylesheet");
}
function elementIsMetaElementWithName(element, name) {
    const tagName = element.localName;
    return tagName == "meta" && element.getAttribute("name") == name;
}
function elementWithoutNonce(element) {
    if (element.hasAttribute("nonce")) {
        element.setAttribute("nonce", "");
    }
    return element;
}

class PageSnapshot extends Snapshot {
    static fromHTMLString(html = "") {
        return this.fromDocument(parseHTMLDocument(html));
    }
    static fromElement(element) {
        return this.fromDocument(element.ownerDocument);
    }
    static fromDocument({ head, body }) {
        return new this(body, new HeadSnapshot(head));
    }
    constructor(element, headSnapshot) {
        super(element);
        this.headSnapshot = headSnapshot;
    }
    clone() {
        const clonedElement = this.element.cloneNode(true);
        const selectElements = this.element.querySelectorAll("select");
        const clonedSelectElements = clonedElement.querySelectorAll("select");
        for (const [index, source] of selectElements.entries()) {
            const clone = clonedSelectElements[index];
            for (const option of clone.selectedOptions)
                option.selected = false;
            for (const option of source.selectedOptions)
                clone.options[option.index].selected = true;
        }
        for (const clonedPasswordInput of clonedElement.querySelectorAll('input[type="password"]')) {
            clonedPasswordInput.value = "";
        }
        return new PageSnapshot(clonedElement, this.headSnapshot);
    }
    get headElement() {
        return this.headSnapshot.element;
    }
    get rootLocation() {
        var _a;
        const root = (_a = this.getSetting("root")) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    get cacheControlValue() {
        return this.getSetting("cache-control");
    }
    get isPreviewable() {
        return this.cacheControlValue != "no-preview";
    }
    get isCacheable() {
        return this.cacheControlValue != "no-cache";
    }
    get isVisitable() {
        return this.getSetting("visit-control") != "reload";
    }
    getSetting(name) {
        return this.headSnapshot.getMetaValue(`turbo-${name}`);
    }
}

var TimingMetric;
(function (TimingMetric) {
    TimingMetric["visitStart"] = "visitStart";
    TimingMetric["requestStart"] = "requestStart";
    TimingMetric["requestEnd"] = "requestEnd";
    TimingMetric["visitEnd"] = "visitEnd";
})(TimingMetric || (TimingMetric = {}));
var VisitState;
(function (VisitState) {
    VisitState["initialized"] = "initialized";
    VisitState["started"] = "started";
    VisitState["canceled"] = "canceled";
    VisitState["failed"] = "failed";
    VisitState["completed"] = "completed";
})(VisitState || (VisitState = {}));
const defaultOptions = {
    action: "advance",
    historyChanged: false,
    visitCachedSnapshot: () => { },
    willRender: true,
    updateHistory: true,
    shouldCacheSnapshot: true,
    acceptsStreamResponse: false,
};
var SystemStatusCode;
(function (SystemStatusCode) {
    SystemStatusCode[SystemStatusCode["networkFailure"] = 0] = "networkFailure";
    SystemStatusCode[SystemStatusCode["timeoutFailure"] = -1] = "timeoutFailure";
    SystemStatusCode[SystemStatusCode["contentTypeMismatch"] = -2] = "contentTypeMismatch";
})(SystemStatusCode || (SystemStatusCode = {}));
class Visit {
    constructor(delegate, location, restorationIdentifier, options = {}) {
        this.identifier = uuid();
        this.timingMetrics = {};
        this.followedRedirect = false;
        this.historyChanged = false;
        this.scrolled = false;
        this.shouldCacheSnapshot = true;
        this.acceptsStreamResponse = false;
        this.snapshotCached = false;
        this.state = VisitState.initialized;
        this.delegate = delegate;
        this.location = location;
        this.restorationIdentifier = restorationIdentifier || uuid();
        const { action, historyChanged, referrer, snapshot, snapshotHTML, response, visitCachedSnapshot, willRender, updateHistory, shouldCacheSnapshot, acceptsStreamResponse, } = Object.assign(Object.assign({}, defaultOptions), options);
        this.action = action;
        this.historyChanged = historyChanged;
        this.referrer = referrer;
        this.snapshot = snapshot;
        this.snapshotHTML = snapshotHTML;
        this.response = response;
        this.isSamePage = this.delegate.locationWithActionIsSamePage(this.location, this.action);
        this.visitCachedSnapshot = visitCachedSnapshot;
        this.willRender = willRender;
        this.updateHistory = updateHistory;
        this.scrolled = !willRender;
        this.shouldCacheSnapshot = shouldCacheSnapshot;
        this.acceptsStreamResponse = acceptsStreamResponse;
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    get restorationData() {
        return this.history.getRestorationDataForIdentifier(this.restorationIdentifier);
    }
    get silent() {
        return this.isSamePage;
    }
    start() {
        if (this.state == VisitState.initialized) {
            this.recordTimingMetric(TimingMetric.visitStart);
            this.state = VisitState.started;
            this.adapter.visitStarted(this);
            this.delegate.visitStarted(this);
        }
    }
    cancel() {
        if (this.state == VisitState.started) {
            if (this.request) {
                this.request.cancel();
            }
            this.cancelRender();
            this.state = VisitState.canceled;
        }
    }
    complete() {
        if (this.state == VisitState.started) {
            this.recordTimingMetric(TimingMetric.visitEnd);
            this.state = VisitState.completed;
            this.followRedirect();
            if (!this.followedRedirect) {
                this.adapter.visitCompleted(this);
                this.delegate.visitCompleted(this);
            }
        }
    }
    fail() {
        if (this.state == VisitState.started) {
            this.state = VisitState.failed;
            this.adapter.visitFailed(this);
        }
    }
    changeHistory() {
        var _a;
        if (!this.historyChanged && this.updateHistory) {
            const actionForHistory = this.location.href === ((_a = this.referrer) === null || _a === void 0 ? void 0 : _a.href) ? "replace" : this.action;
            const method = getHistoryMethodForAction(actionForHistory);
            this.history.update(method, this.location, this.restorationIdentifier);
            this.historyChanged = true;
        }
    }
    issueRequest() {
        if (this.hasPreloadedResponse()) {
            this.simulateRequest();
        }
        else if (this.shouldIssueRequest() && !this.request) {
            this.request = new FetchRequest(this, FetchMethod.get, this.location);
            this.request.perform();
        }
    }
    simulateRequest() {
        if (this.response) {
            this.startRequest();
            this.recordResponse();
            this.finishRequest();
        }
    }
    startRequest() {
        this.recordTimingMetric(TimingMetric.requestStart);
        this.adapter.visitRequestStarted(this);
    }
    recordResponse(response = this.response) {
        this.response = response;
        if (response) {
            const { statusCode } = response;
            if (isSuccessful(statusCode)) {
                this.adapter.visitRequestCompleted(this);
            }
            else {
                this.adapter.visitRequestFailedWithStatusCode(this, statusCode);
            }
        }
    }
    finishRequest() {
        this.recordTimingMetric(TimingMetric.requestEnd);
        this.adapter.visitRequestFinished(this);
    }
    loadResponse() {
        if (this.response) {
            const { statusCode, responseHTML } = this.response;
            this.render(async () => {
                if (this.shouldCacheSnapshot)
                    this.cacheSnapshot();
                if (this.view.renderPromise)
                    await this.view.renderPromise;
                if (isSuccessful(statusCode) && responseHTML != null) {
                    await this.view.renderPage(PageSnapshot.fromHTMLString(responseHTML), false, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    this.complete();
                }
                else {
                    await this.view.renderError(PageSnapshot.fromHTMLString(responseHTML), this);
                    this.adapter.visitRendered(this);
                    this.fail();
                }
            });
        }
    }
    getCachedSnapshot() {
        const snapshot = this.view.getCachedSnapshotForLocation(this.location) || this.getPreloadedSnapshot();
        if (snapshot && (!getAnchor(this.location) || snapshot.hasAnchor(getAnchor(this.location)))) {
            if (this.action == "restore" || snapshot.isPreviewable) {
                return snapshot;
            }
        }
    }
    getPreloadedSnapshot() {
        if (this.snapshotHTML) {
            return PageSnapshot.fromHTMLString(this.snapshotHTML);
        }
    }
    hasCachedSnapshot() {
        return this.getCachedSnapshot() != null;
    }
    loadCachedSnapshot() {
        const snapshot = this.getCachedSnapshot();
        if (snapshot) {
            const isPreview = this.shouldIssueRequest();
            this.render(async () => {
                this.cacheSnapshot();
                if (this.isSamePage) {
                    this.adapter.visitRendered(this);
                }
                else {
                    if (this.view.renderPromise)
                        await this.view.renderPromise;
                    await this.view.renderPage(snapshot, isPreview, this.willRender, this);
                    this.performScroll();
                    this.adapter.visitRendered(this);
                    if (!isPreview) {
                        this.complete();
                    }
                }
            });
        }
    }
    followRedirect() {
        var _a;
        if (this.redirectedToLocation && !this.followedRedirect && ((_a = this.response) === null || _a === void 0 ? void 0 : _a.redirected)) {
            this.adapter.visitProposedToLocation(this.redirectedToLocation, {
                action: "replace",
                response: this.response,
                shouldCacheSnapshot: false,
                willRender: false,
            });
            this.followedRedirect = true;
        }
    }
    goToSamePageAnchor() {
        if (this.isSamePage) {
            this.render(async () => {
                this.cacheSnapshot();
                this.performScroll();
                this.changeHistory();
                this.adapter.visitRendered(this);
            });
        }
    }
    prepareRequest(request) {
        if (this.acceptsStreamResponse) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted() {
        this.startRequest();
    }
    requestPreventedHandlingResponse(_request, _response) { }
    async requestSucceededWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.redirectedToLocation = response.redirected ? response.location : undefined;
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    async requestFailedWithResponse(request, response) {
        const responseHTML = await response.responseHTML;
        const { redirected, statusCode } = response;
        if (responseHTML == undefined) {
            this.recordResponse({
                statusCode: SystemStatusCode.contentTypeMismatch,
                redirected,
            });
        }
        else {
            this.recordResponse({ statusCode: statusCode, responseHTML, redirected });
        }
    }
    requestErrored(_request, _error) {
        this.recordResponse({
            statusCode: SystemStatusCode.networkFailure,
            redirected: false,
        });
    }
    requestFinished() {
        this.finishRequest();
    }
    performScroll() {
        if (!this.scrolled && !this.view.forceReloaded) {
            if (this.action == "restore") {
                this.scrollToRestoredPosition() || this.scrollToAnchor() || this.view.scrollToTop();
            }
            else {
                this.scrollToAnchor() || this.view.scrollToTop();
            }
            if (this.isSamePage) {
                this.delegate.visitScrolledToSamePageLocation(this.view.lastRenderedLocation, this.location);
            }
            this.scrolled = true;
        }
    }
    scrollToRestoredPosition() {
        const { scrollPosition } = this.restorationData;
        if (scrollPosition) {
            this.view.scrollToPosition(scrollPosition);
            return true;
        }
    }
    scrollToAnchor() {
        const anchor = getAnchor(this.location);
        if (anchor != null) {
            this.view.scrollToAnchor(anchor);
            return true;
        }
    }
    recordTimingMetric(metric) {
        this.timingMetrics[metric] = new Date().getTime();
    }
    getTimingMetrics() {
        return Object.assign({}, this.timingMetrics);
    }
    getHistoryMethodForAction(action) {
        switch (action) {
            case "replace":
                return history.replaceState;
            case "advance":
            case "restore":
                return history.pushState;
        }
    }
    hasPreloadedResponse() {
        return typeof this.response == "object";
    }
    shouldIssueRequest() {
        if (this.isSamePage) {
            return false;
        }
        else if (this.action == "restore") {
            return !this.hasCachedSnapshot();
        }
        else {
            return this.willRender;
        }
    }
    cacheSnapshot() {
        if (!this.snapshotCached) {
            this.view.cacheSnapshot(this.snapshot).then((snapshot) => snapshot && this.visitCachedSnapshot(snapshot));
            this.snapshotCached = true;
        }
    }
    async render(callback) {
        this.cancelRender();
        await new Promise((resolve) => {
            this.frame = requestAnimationFrame(() => resolve());
        });
        await callback();
        delete this.frame;
    }
    cancelRender() {
        if (this.frame) {
            cancelAnimationFrame(this.frame);
            delete this.frame;
        }
    }
}
function isSuccessful(statusCode) {
    return statusCode >= 200 && statusCode < 300;
}

class BrowserAdapter {
    constructor(session) {
        this.progressBar = new ProgressBar();
        this.showProgressBar = () => {
            this.progressBar.show();
        };
        this.session = session;
    }
    visitProposedToLocation(location, options) {
        this.navigator.startVisit(location, (options === null || options === void 0 ? void 0 : options.restorationIdentifier) || uuid(), options);
    }
    visitStarted(visit) {
        this.location = visit.location;
        visit.loadCachedSnapshot();
        visit.issueRequest();
        visit.goToSamePageAnchor();
    }
    visitRequestStarted(visit) {
        this.progressBar.setValue(0);
        if (visit.hasCachedSnapshot() || visit.action != "restore") {
            this.showVisitProgressBarAfterDelay();
        }
        else {
            this.showProgressBar();
        }
    }
    visitRequestCompleted(visit) {
        visit.loadResponse();
    }
    visitRequestFailedWithStatusCode(visit, statusCode) {
        switch (statusCode) {
            case SystemStatusCode.networkFailure:
            case SystemStatusCode.timeoutFailure:
            case SystemStatusCode.contentTypeMismatch:
                return this.reload({
                    reason: "request_failed",
                    context: {
                        statusCode,
                    },
                });
            default:
                return visit.loadResponse();
        }
    }
    visitRequestFinished(_visit) {
        this.progressBar.setValue(1);
        this.hideVisitProgressBar();
    }
    visitCompleted(_visit) { }
    pageInvalidated(reason) {
        this.reload(reason);
    }
    visitFailed(_visit) { }
    visitRendered(_visit) { }
    formSubmissionStarted(_formSubmission) {
        this.progressBar.setValue(0);
        this.showFormProgressBarAfterDelay();
    }
    formSubmissionFinished(_formSubmission) {
        this.progressBar.setValue(1);
        this.hideFormProgressBar();
    }
    showVisitProgressBarAfterDelay() {
        this.visitProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
    }
    hideVisitProgressBar() {
        this.progressBar.hide();
        if (this.visitProgressBarTimeout != null) {
            window.clearTimeout(this.visitProgressBarTimeout);
            delete this.visitProgressBarTimeout;
        }
    }
    showFormProgressBarAfterDelay() {
        if (this.formProgressBarTimeout == null) {
            this.formProgressBarTimeout = window.setTimeout(this.showProgressBar, this.session.progressBarDelay);
        }
    }
    hideFormProgressBar() {
        this.progressBar.hide();
        if (this.formProgressBarTimeout != null) {
            window.clearTimeout(this.formProgressBarTimeout);
            delete this.formProgressBarTimeout;
        }
    }
    reload(reason) {
        var _a;
        dispatch("turbo:reload", { detail: reason });
        window.location.href = ((_a = this.location) === null || _a === void 0 ? void 0 : _a.toString()) || window.location.href;
    }
    get navigator() {
        return this.session.navigator;
    }
}

class CacheObserver {
    constructor() {
        this.selector = "[data-turbo-temporary]";
        this.deprecatedSelector = "[data-turbo-cache=false]";
        this.started = false;
        this.removeTemporaryElements = ((_event) => {
            for (const element of this.temporaryElements) {
                element.remove();
            }
        });
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-cache", this.removeTemporaryElements, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-cache", this.removeTemporaryElements, false);
        }
    }
    get temporaryElements() {
        return [...document.querySelectorAll(this.selector), ...this.temporaryElementsWithDeprecation];
    }
    get temporaryElementsWithDeprecation() {
        const elements = document.querySelectorAll(this.deprecatedSelector);
        if (elements.length) {
            console.warn(`The ${this.deprecatedSelector} selector is deprecated and will be removed in a future version. Use ${this.selector} instead.`);
        }
        return [...elements];
    }
}

class FrameRedirector {
    constructor(session, element) {
        this.session = session;
        this.element = element;
        this.linkInterceptor = new LinkInterceptor(this, element);
        this.formSubmitObserver = new FormSubmitObserver(this, element);
    }
    start() {
        this.linkInterceptor.start();
        this.formSubmitObserver.start();
    }
    stop() {
        this.linkInterceptor.stop();
        this.formSubmitObserver.stop();
    }
    shouldInterceptLinkClick(element, _location, _event) {
        return this.shouldRedirect(element);
    }
    linkClickIntercepted(element, url, event) {
        const frame = this.findFrameElement(element);
        if (frame) {
            frame.delegate.linkClickIntercepted(element, url, event);
        }
    }
    willSubmitForm(element, submitter) {
        return (element.closest("turbo-frame") == null &&
            this.shouldSubmit(element, submitter) &&
            this.shouldRedirect(element, submitter));
    }
    formSubmitted(element, submitter) {
        const frame = this.findFrameElement(element, submitter);
        if (frame) {
            frame.delegate.formSubmitted(element, submitter);
        }
    }
    shouldSubmit(form, submitter) {
        var _a;
        const action = getAction(form, submitter);
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const rootLocation = expandURL((_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/");
        return this.shouldRedirect(form, submitter) && locationIsVisitable(action, rootLocation);
    }
    shouldRedirect(element, submitter) {
        const isNavigatable = element instanceof HTMLFormElement
            ? this.session.submissionIsNavigatable(element, submitter)
            : this.session.elementIsNavigatable(element);
        if (isNavigatable) {
            const frame = this.findFrameElement(element, submitter);
            return frame ? frame != element.closest("turbo-frame") : false;
        }
        else {
            return false;
        }
    }
    findFrameElement(element, submitter) {
        const id = (submitter === null || submitter === void 0 ? void 0 : submitter.getAttribute("data-turbo-frame")) || element.getAttribute("data-turbo-frame");
        if (id && id != "_top") {
            const frame = this.element.querySelector(`#${id}:not([disabled])`);
            if (frame instanceof FrameElement) {
                return frame;
            }
        }
    }
}

class History {
    constructor(delegate) {
        this.restorationIdentifier = uuid();
        this.restorationData = {};
        this.started = false;
        this.pageLoaded = false;
        this.onPopState = (event) => {
            if (this.shouldHandlePopState()) {
                const { turbo } = event.state || {};
                if (turbo) {
                    this.location = new URL(window.location.href);
                    const { restorationIdentifier } = turbo;
                    this.restorationIdentifier = restorationIdentifier;
                    this.delegate.historyPoppedToLocationWithRestorationIdentifier(this.location, restorationIdentifier);
                }
            }
        };
        this.onPageLoad = async (_event) => {
            await nextMicrotask();
            this.pageLoaded = true;
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("popstate", this.onPopState, false);
            addEventListener("load", this.onPageLoad, false);
            this.started = true;
            this.replace(new URL(window.location.href));
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("popstate", this.onPopState, false);
            removeEventListener("load", this.onPageLoad, false);
            this.started = false;
        }
    }
    push(location, restorationIdentifier) {
        this.update(history.pushState, location, restorationIdentifier);
    }
    replace(location, restorationIdentifier) {
        this.update(history.replaceState, location, restorationIdentifier);
    }
    update(method, location, restorationIdentifier = uuid()) {
        const state = { turbo: { restorationIdentifier } };
        method.call(history, state, "", location.href);
        this.location = location;
        this.restorationIdentifier = restorationIdentifier;
    }
    getRestorationDataForIdentifier(restorationIdentifier) {
        return this.restorationData[restorationIdentifier] || {};
    }
    updateRestorationData(additionalData) {
        const { restorationIdentifier } = this;
        const restorationData = this.restorationData[restorationIdentifier];
        this.restorationData[restorationIdentifier] = Object.assign(Object.assign({}, restorationData), additionalData);
    }
    assumeControlOfScrollRestoration() {
        var _a;
        if (!this.previousScrollRestoration) {
            this.previousScrollRestoration = (_a = history.scrollRestoration) !== null && _a !== void 0 ? _a : "auto";
            history.scrollRestoration = "manual";
        }
    }
    relinquishControlOfScrollRestoration() {
        if (this.previousScrollRestoration) {
            history.scrollRestoration = this.previousScrollRestoration;
            delete this.previousScrollRestoration;
        }
    }
    shouldHandlePopState() {
        return this.pageIsLoaded();
    }
    pageIsLoaded() {
        return this.pageLoaded || document.readyState == "complete";
    }
}

class Navigator {
    constructor(delegate) {
        this.delegate = delegate;
    }
    proposeVisit(location, options = {}) {
        if (this.delegate.allowsVisitingLocationWithAction(location, options.action)) {
            if (locationIsVisitable(location, this.view.snapshot.rootLocation)) {
                this.delegate.visitProposedToLocation(location, options);
            }
            else {
                window.location.href = location.toString();
            }
        }
    }
    startVisit(locatable, restorationIdentifier, options = {}) {
        this.stop();
        this.currentVisit = new Visit(this, expandURL(locatable), restorationIdentifier, Object.assign({ referrer: this.location }, options));
        this.currentVisit.start();
    }
    submitForm(form, submitter) {
        this.stop();
        this.formSubmission = new FormSubmission(this, form, submitter, true);
        this.formSubmission.start();
    }
    stop() {
        if (this.formSubmission) {
            this.formSubmission.stop();
            delete this.formSubmission;
        }
        if (this.currentVisit) {
            this.currentVisit.cancel();
            delete this.currentVisit;
        }
    }
    get adapter() {
        return this.delegate.adapter;
    }
    get view() {
        return this.delegate.view;
    }
    get history() {
        return this.delegate.history;
    }
    formSubmissionStarted(formSubmission) {
        if (typeof this.adapter.formSubmissionStarted === "function") {
            this.adapter.formSubmissionStarted(formSubmission);
        }
    }
    async formSubmissionSucceededWithResponse(formSubmission, fetchResponse) {
        if (formSubmission == this.formSubmission) {
            const responseHTML = await fetchResponse.responseHTML;
            if (responseHTML) {
                const shouldCacheSnapshot = formSubmission.isSafe;
                if (!shouldCacheSnapshot) {
                    this.view.clearSnapshotCache();
                }
                const { statusCode, redirected } = fetchResponse;
                const action = this.getActionForFormSubmission(formSubmission);
                const visitOptions = {
                    action,
                    shouldCacheSnapshot,
                    response: { statusCode, responseHTML, redirected },
                };
                this.proposeVisit(fetchResponse.location, visitOptions);
            }
        }
    }
    async formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        const responseHTML = await fetchResponse.responseHTML;
        if (responseHTML) {
            const snapshot = PageSnapshot.fromHTMLString(responseHTML);
            if (fetchResponse.serverError) {
                await this.view.renderError(snapshot, this.currentVisit);
            }
            else {
                await this.view.renderPage(snapshot, false, true, this.currentVisit);
            }
            this.view.scrollToTop();
            this.view.clearSnapshotCache();
        }
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished(formSubmission) {
        if (typeof this.adapter.formSubmissionFinished === "function") {
            this.adapter.formSubmissionFinished(formSubmission);
        }
    }
    visitStarted(visit) {
        this.delegate.visitStarted(visit);
    }
    visitCompleted(visit) {
        this.delegate.visitCompleted(visit);
    }
    locationWithActionIsSamePage(location, action) {
        const anchor = getAnchor(location);
        const currentAnchor = getAnchor(this.view.lastRenderedLocation);
        const isRestorationToTop = action === "restore" && typeof anchor === "undefined";
        return (action !== "replace" &&
            getRequestURL(location) === getRequestURL(this.view.lastRenderedLocation) &&
            (isRestorationToTop || (anchor != null && anchor !== currentAnchor)));
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.delegate.visitScrolledToSamePageLocation(oldURL, newURL);
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    getActionForFormSubmission({ submitter, formElement }) {
        return getVisitAction(submitter, formElement) || "advance";
    }
}

var PageStage;
(function (PageStage) {
    PageStage[PageStage["initial"] = 0] = "initial";
    PageStage[PageStage["loading"] = 1] = "loading";
    PageStage[PageStage["interactive"] = 2] = "interactive";
    PageStage[PageStage["complete"] = 3] = "complete";
})(PageStage || (PageStage = {}));
class PageObserver {
    constructor(delegate) {
        this.stage = PageStage.initial;
        this.started = false;
        this.interpretReadyState = () => {
            const { readyState } = this;
            if (readyState == "interactive") {
                this.pageIsInteractive();
            }
            else if (readyState == "complete") {
                this.pageIsComplete();
            }
        };
        this.pageWillUnload = () => {
            this.delegate.pageWillUnload();
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            if (this.stage == PageStage.initial) {
                this.stage = PageStage.loading;
            }
            document.addEventListener("readystatechange", this.interpretReadyState, false);
            addEventListener("pagehide", this.pageWillUnload, false);
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            document.removeEventListener("readystatechange", this.interpretReadyState, false);
            removeEventListener("pagehide", this.pageWillUnload, false);
            this.started = false;
        }
    }
    pageIsInteractive() {
        if (this.stage == PageStage.loading) {
            this.stage = PageStage.interactive;
            this.delegate.pageBecameInteractive();
        }
    }
    pageIsComplete() {
        this.pageIsInteractive();
        if (this.stage == PageStage.interactive) {
            this.stage = PageStage.complete;
            this.delegate.pageLoaded();
        }
    }
    get readyState() {
        return document.readyState;
    }
}

class ScrollObserver {
    constructor(delegate) {
        this.started = false;
        this.onScroll = () => {
            this.updatePosition({ x: window.pageXOffset, y: window.pageYOffset });
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            addEventListener("scroll", this.onScroll, false);
            this.onScroll();
            this.started = true;
        }
    }
    stop() {
        if (this.started) {
            removeEventListener("scroll", this.onScroll, false);
            this.started = false;
        }
    }
    updatePosition(position) {
        this.delegate.scrollPositionChanged(position);
    }
}

class StreamMessageRenderer {
    render({ fragment }) {
        Bardo.preservingPermanentElements(this, getPermanentElementMapForFragment(fragment), () => document.documentElement.appendChild(fragment));
    }
    enteringBardo(currentPermanentElement, newPermanentElement) {
        newPermanentElement.replaceWith(currentPermanentElement.cloneNode(true));
    }
    leavingBardo() { }
}
function getPermanentElementMapForFragment(fragment) {
    const permanentElementsInDocument = queryPermanentElementsAll(document.documentElement);
    const permanentElementMap = {};
    for (const permanentElementInDocument of permanentElementsInDocument) {
        const { id } = permanentElementInDocument;
        for (const streamElement of fragment.querySelectorAll("turbo-stream")) {
            const elementInStream = getPermanentElementById(streamElement.templateElement.content, id);
            if (elementInStream) {
                permanentElementMap[id] = [permanentElementInDocument, elementInStream];
            }
        }
    }
    return permanentElementMap;
}

class StreamObserver {
    constructor(delegate) {
        this.sources = new Set();
        this.started = false;
        this.inspectFetchResponse = ((event) => {
            const response = fetchResponseFromEvent(event);
            if (response && fetchResponseIsStream(response)) {
                event.preventDefault();
                this.receiveMessageResponse(response);
            }
        });
        this.receiveMessageEvent = (event) => {
            if (this.started && typeof event.data == "string") {
                this.receiveMessageHTML(event.data);
            }
        };
        this.delegate = delegate;
    }
    start() {
        if (!this.started) {
            this.started = true;
            addEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    stop() {
        if (this.started) {
            this.started = false;
            removeEventListener("turbo:before-fetch-response", this.inspectFetchResponse, false);
        }
    }
    connectStreamSource(source) {
        if (!this.streamSourceIsConnected(source)) {
            this.sources.add(source);
            source.addEventListener("message", this.receiveMessageEvent, false);
        }
    }
    disconnectStreamSource(source) {
        if (this.streamSourceIsConnected(source)) {
            this.sources.delete(source);
            source.removeEventListener("message", this.receiveMessageEvent, false);
        }
    }
    streamSourceIsConnected(source) {
        return this.sources.has(source);
    }
    async receiveMessageResponse(response) {
        const html = await response.responseHTML;
        if (html) {
            this.receiveMessageHTML(html);
        }
    }
    receiveMessageHTML(html) {
        this.delegate.receivedMessageFromStream(StreamMessage.wrap(html));
    }
}
function fetchResponseFromEvent(event) {
    var _a;
    const fetchResponse = (_a = event.detail) === null || _a === void 0 ? void 0 : _a.fetchResponse;
    if (fetchResponse instanceof FetchResponse) {
        return fetchResponse;
    }
}
function fetchResponseIsStream(response) {
    var _a;
    const contentType = (_a = response.contentType) !== null && _a !== void 0 ? _a : "";
    return contentType.startsWith(StreamMessage.contentType);
}

class ErrorRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        const { documentElement, body } = document;
        documentElement.replaceChild(newElement, body);
    }
    async render() {
        this.replaceHeadAndBody();
        this.activateScriptElements();
    }
    replaceHeadAndBody() {
        const { documentElement, head } = document;
        documentElement.replaceChild(this.newHead, head);
        this.renderElement(this.currentElement, this.newElement);
    }
    activateScriptElements() {
        for (const replaceableElement of this.scriptElements) {
            const parentNode = replaceableElement.parentNode;
            if (parentNode) {
                const element = activateScriptElement(replaceableElement);
                parentNode.replaceChild(element, replaceableElement);
            }
        }
    }
    get newHead() {
        return this.newSnapshot.headSnapshot.element;
    }
    get scriptElements() {
        return document.documentElement.querySelectorAll("script");
    }
}

class PageRenderer extends Renderer {
    static renderElement(currentElement, newElement) {
        if (document.body && newElement instanceof HTMLBodyElement) {
            document.body.replaceWith(newElement);
        }
        else {
            document.documentElement.appendChild(newElement);
        }
    }
    get shouldRender() {
        return this.newSnapshot.isVisitable && this.trackedElementsAreIdentical;
    }
    get reloadReason() {
        if (!this.newSnapshot.isVisitable) {
            return {
                reason: "turbo_visit_control_is_reload",
            };
        }
        if (!this.trackedElementsAreIdentical) {
            return {
                reason: "tracked_element_mismatch",
            };
        }
    }
    async prepareToRender() {
        await this.mergeHead();
    }
    async render() {
        if (this.willRender) {
            await this.replaceBody();
        }
    }
    finishRendering() {
        super.finishRendering();
        if (!this.isPreview) {
            this.focusFirstAutofocusableElement();
        }
    }
    get currentHeadSnapshot() {
        return this.currentSnapshot.headSnapshot;
    }
    get newHeadSnapshot() {
        return this.newSnapshot.headSnapshot;
    }
    get newElement() {
        return this.newSnapshot.element;
    }
    async mergeHead() {
        const mergedHeadElements = this.mergeProvisionalElements();
        const newStylesheetElements = this.copyNewHeadStylesheetElements();
        this.copyNewHeadScriptElements();
        await mergedHeadElements;
        await newStylesheetElements;
    }
    async replaceBody() {
        await this.preservingPermanentElements(async () => {
            this.activateNewBody();
            await this.assignNewBody();
        });
    }
    get trackedElementsAreIdentical() {
        return this.currentHeadSnapshot.trackedElementSignature == this.newHeadSnapshot.trackedElementSignature;
    }
    async copyNewHeadStylesheetElements() {
        const loadingElements = [];
        for (const element of this.newHeadStylesheetElements) {
            loadingElements.push(waitForLoad(element));
            document.head.appendChild(element);
        }
        await Promise.all(loadingElements);
    }
    copyNewHeadScriptElements() {
        for (const element of this.newHeadScriptElements) {
            document.head.appendChild(activateScriptElement(element));
        }
    }
    async mergeProvisionalElements() {
        const newHeadElements = [...this.newHeadProvisionalElements];
        for (const element of this.currentHeadProvisionalElements) {
            if (!this.isCurrentElementInElementList(element, newHeadElements)) {
                document.head.removeChild(element);
            }
        }
        for (const element of newHeadElements) {
            document.head.appendChild(element);
        }
    }
    isCurrentElementInElementList(element, elementList) {
        for (const [index, newElement] of elementList.entries()) {
            if (element.tagName == "TITLE") {
                if (newElement.tagName != "TITLE") {
                    continue;
                }
                if (element.innerHTML == newElement.innerHTML) {
                    elementList.splice(index, 1);
                    return true;
                }
            }
            if (newElement.isEqualNode(element)) {
                elementList.splice(index, 1);
                return true;
            }
        }
        return false;
    }
    removeCurrentHeadProvisionalElements() {
        for (const element of this.currentHeadProvisionalElements) {
            document.head.removeChild(element);
        }
    }
    copyNewHeadProvisionalElements() {
        for (const element of this.newHeadProvisionalElements) {
            document.head.appendChild(element);
        }
    }
    activateNewBody() {
        document.adoptNode(this.newElement);
        this.activateNewBodyScriptElements();
    }
    activateNewBodyScriptElements() {
        for (const inertScriptElement of this.newBodyScriptElements) {
            const activatedScriptElement = activateScriptElement(inertScriptElement);
            inertScriptElement.replaceWith(activatedScriptElement);
        }
    }
    async assignNewBody() {
        await this.renderElement(this.currentElement, this.newElement);
    }
    get newHeadStylesheetElements() {
        return this.newHeadSnapshot.getStylesheetElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get newHeadScriptElements() {
        return this.newHeadSnapshot.getScriptElementsNotInSnapshot(this.currentHeadSnapshot);
    }
    get currentHeadProvisionalElements() {
        return this.currentHeadSnapshot.provisionalElements;
    }
    get newHeadProvisionalElements() {
        return this.newHeadSnapshot.provisionalElements;
    }
    get newBodyScriptElements() {
        return this.newElement.querySelectorAll("script");
    }
}

class SnapshotCache {
    constructor(size) {
        this.keys = [];
        this.snapshots = {};
        this.size = size;
    }
    has(location) {
        return toCacheKey(location) in this.snapshots;
    }
    get(location) {
        if (this.has(location)) {
            const snapshot = this.read(location);
            this.touch(location);
            return snapshot;
        }
    }
    put(location, snapshot) {
        this.write(location, snapshot);
        this.touch(location);
        return snapshot;
    }
    clear() {
        this.snapshots = {};
    }
    read(location) {
        return this.snapshots[toCacheKey(location)];
    }
    write(location, snapshot) {
        this.snapshots[toCacheKey(location)] = snapshot;
    }
    touch(location) {
        const key = toCacheKey(location);
        const index = this.keys.indexOf(key);
        if (index > -1)
            this.keys.splice(index, 1);
        this.keys.unshift(key);
        this.trim();
    }
    trim() {
        for (const key of this.keys.splice(this.size)) {
            delete this.snapshots[key];
        }
    }
}

class PageView extends View {
    constructor() {
        super(...arguments);
        this.snapshotCache = new SnapshotCache(10);
        this.lastRenderedLocation = new URL(location.href);
        this.forceReloaded = false;
    }
    renderPage(snapshot, isPreview = false, willRender = true, visit) {
        const renderer = new PageRenderer(this.snapshot, snapshot, PageRenderer.renderElement, isPreview, willRender);
        if (!renderer.shouldRender) {
            this.forceReloaded = true;
        }
        else {
            visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        }
        return this.render(renderer);
    }
    renderError(snapshot, visit) {
        visit === null || visit === void 0 ? void 0 : visit.changeHistory();
        const renderer = new ErrorRenderer(this.snapshot, snapshot, ErrorRenderer.renderElement, false);
        return this.render(renderer);
    }
    clearSnapshotCache() {
        this.snapshotCache.clear();
    }
    async cacheSnapshot(snapshot = this.snapshot) {
        if (snapshot.isCacheable) {
            this.delegate.viewWillCacheSnapshot();
            const { lastRenderedLocation: location } = this;
            await nextEventLoopTick();
            const cachedSnapshot = snapshot.clone();
            this.snapshotCache.put(location, cachedSnapshot);
            return cachedSnapshot;
        }
    }
    getCachedSnapshotForLocation(location) {
        return this.snapshotCache.get(location);
    }
    get snapshot() {
        return PageSnapshot.fromElement(this.element);
    }
}

class Preloader {
    constructor(delegate) {
        this.selector = "a[data-turbo-preload]";
        this.delegate = delegate;
    }
    get snapshotCache() {
        return this.delegate.navigator.view.snapshotCache;
    }
    start() {
        if (document.readyState === "loading") {
            return document.addEventListener("DOMContentLoaded", () => {
                this.preloadOnLoadLinksForView(document.body);
            });
        }
        else {
            this.preloadOnLoadLinksForView(document.body);
        }
    }
    preloadOnLoadLinksForView(element) {
        for (const link of element.querySelectorAll(this.selector)) {
            this.preloadURL(link);
        }
    }
    async preloadURL(link) {
        const location = new URL(link.href);
        if (this.snapshotCache.has(location)) {
            return;
        }
        try {
            const response = await fetch(location.toString(), { headers: { "VND.PREFETCH": "true", Accept: "text/html" } });
            const responseText = await response.text();
            const snapshot = PageSnapshot.fromHTMLString(responseText);
            this.snapshotCache.put(location, snapshot);
        }
        catch (_) {
        }
    }
}

class Session {
    constructor() {
        this.navigator = new Navigator(this);
        this.history = new History(this);
        this.preloader = new Preloader(this);
        this.view = new PageView(this, document.documentElement);
        this.adapter = new BrowserAdapter(this);
        this.pageObserver = new PageObserver(this);
        this.cacheObserver = new CacheObserver();
        this.linkClickObserver = new LinkClickObserver(this, window);
        this.formSubmitObserver = new FormSubmitObserver(this, document);
        this.scrollObserver = new ScrollObserver(this);
        this.streamObserver = new StreamObserver(this);
        this.formLinkClickObserver = new FormLinkClickObserver(this, document.documentElement);
        this.frameRedirector = new FrameRedirector(this, document.documentElement);
        this.streamMessageRenderer = new StreamMessageRenderer();
        this.drive = true;
        this.enabled = true;
        this.progressBarDelay = 500;
        this.started = false;
        this.formMode = "on";
    }
    start() {
        if (!this.started) {
            this.pageObserver.start();
            this.cacheObserver.start();
            this.formLinkClickObserver.start();
            this.linkClickObserver.start();
            this.formSubmitObserver.start();
            this.scrollObserver.start();
            this.streamObserver.start();
            this.frameRedirector.start();
            this.history.start();
            this.preloader.start();
            this.started = true;
            this.enabled = true;
        }
    }
    disable() {
        this.enabled = false;
    }
    stop() {
        if (this.started) {
            this.pageObserver.stop();
            this.cacheObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkClickObserver.stop();
            this.formSubmitObserver.stop();
            this.scrollObserver.stop();
            this.streamObserver.stop();
            this.frameRedirector.stop();
            this.history.stop();
            this.started = false;
        }
    }
    registerAdapter(adapter) {
        this.adapter = adapter;
    }
    visit(location, options = {}) {
        const frameElement = options.frame ? document.getElementById(options.frame) : null;
        if (frameElement instanceof FrameElement) {
            frameElement.src = location.toString();
            frameElement.loaded;
        }
        else {
            this.navigator.proposeVisit(expandURL(location), options);
        }
    }
    connectStreamSource(source) {
        this.streamObserver.connectStreamSource(source);
    }
    disconnectStreamSource(source) {
        this.streamObserver.disconnectStreamSource(source);
    }
    renderStreamMessage(message) {
        this.streamMessageRenderer.render(StreamMessage.wrap(message));
    }
    clearCache() {
        this.view.clearSnapshotCache();
    }
    setProgressBarDelay(delay) {
        this.progressBarDelay = delay;
    }
    setFormMode(mode) {
        this.formMode = mode;
    }
    get location() {
        return this.history.location;
    }
    get restorationIdentifier() {
        return this.history.restorationIdentifier;
    }
    historyPoppedToLocationWithRestorationIdentifier(location, restorationIdentifier) {
        if (this.enabled) {
            this.navigator.startVisit(location, restorationIdentifier, {
                action: "restore",
                historyChanged: true,
            });
        }
        else {
            this.adapter.pageInvalidated({
                reason: "turbo_disabled",
            });
        }
    }
    scrollPositionChanged(position) {
        this.history.updateRestorationData({ scrollPosition: position });
    }
    willSubmitFormLinkToLocation(link, location) {
        return this.elementIsNavigatable(link) && locationIsVisitable(location, this.snapshot.rootLocation);
    }
    submittedFormLinkToLocation() { }
    willFollowLinkToLocation(link, location, event) {
        return (this.elementIsNavigatable(link) &&
            locationIsVisitable(location, this.snapshot.rootLocation) &&
            this.applicationAllowsFollowingLinkToLocation(link, location, event));
    }
    followedLinkToLocation(link, location) {
        const action = this.getActionForLink(link);
        const acceptsStreamResponse = link.hasAttribute("data-turbo-stream");
        this.visit(location.href, { action, acceptsStreamResponse });
    }
    allowsVisitingLocationWithAction(location, action) {
        return this.locationWithActionIsSamePage(location, action) || this.applicationAllowsVisitingLocation(location);
    }
    visitProposedToLocation(location, options) {
        extendURLWithDeprecatedProperties(location);
        this.adapter.visitProposedToLocation(location, options);
    }
    visitStarted(visit) {
        if (!visit.acceptsStreamResponse) {
            markAsBusy(document.documentElement);
        }
        extendURLWithDeprecatedProperties(visit.location);
        if (!visit.silent) {
            this.notifyApplicationAfterVisitingLocation(visit.location, visit.action);
        }
    }
    visitCompleted(visit) {
        clearBusyState(document.documentElement);
        this.notifyApplicationAfterPageLoad(visit.getTimingMetrics());
    }
    locationWithActionIsSamePage(location, action) {
        return this.navigator.locationWithActionIsSamePage(location, action);
    }
    visitScrolledToSamePageLocation(oldURL, newURL) {
        this.notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL);
    }
    willSubmitForm(form, submitter) {
        const action = getAction(form, submitter);
        return (this.submissionIsNavigatable(form, submitter) &&
            locationIsVisitable(expandURL(action), this.snapshot.rootLocation));
    }
    formSubmitted(form, submitter) {
        this.navigator.submitForm(form, submitter);
    }
    pageBecameInteractive() {
        this.view.lastRenderedLocation = this.location;
        this.notifyApplicationAfterPageLoad();
    }
    pageLoaded() {
        this.history.assumeControlOfScrollRestoration();
    }
    pageWillUnload() {
        this.history.relinquishControlOfScrollRestoration();
    }
    receivedMessageFromStream(message) {
        this.renderStreamMessage(message);
    }
    viewWillCacheSnapshot() {
        var _a;
        if (!((_a = this.navigator.currentVisit) === null || _a === void 0 ? void 0 : _a.silent)) {
            this.notifyApplicationBeforeCachingSnapshot();
        }
    }
    allowsImmediateRender({ element }, options) {
        const event = this.notifyApplicationBeforeRender(element, options);
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) {
        this.view.lastRenderedLocation = this.history.location;
        this.notifyApplicationAfterRender();
    }
    preloadOnLoadLinksForView(element) {
        this.preloader.preloadOnLoadLinksForView(element);
    }
    viewInvalidated(reason) {
        this.adapter.pageInvalidated(reason);
    }
    frameLoaded(frame) {
        this.notifyApplicationAfterFrameLoad(frame);
    }
    frameRendered(fetchResponse, frame) {
        this.notifyApplicationAfterFrameRender(fetchResponse, frame);
    }
    applicationAllowsFollowingLinkToLocation(link, location, ev) {
        const event = this.notifyApplicationAfterClickingLinkToLocation(link, location, ev);
        return !event.defaultPrevented;
    }
    applicationAllowsVisitingLocation(location) {
        const event = this.notifyApplicationBeforeVisitingLocation(location);
        return !event.defaultPrevented;
    }
    notifyApplicationAfterClickingLinkToLocation(link, location, event) {
        return dispatch("turbo:click", {
            target: link,
            detail: { url: location.href, originalEvent: event },
            cancelable: true,
        });
    }
    notifyApplicationBeforeVisitingLocation(location) {
        return dispatch("turbo:before-visit", {
            detail: { url: location.href },
            cancelable: true,
        });
    }
    notifyApplicationAfterVisitingLocation(location, action) {
        return dispatch("turbo:visit", { detail: { url: location.href, action } });
    }
    notifyApplicationBeforeCachingSnapshot() {
        return dispatch("turbo:before-cache");
    }
    notifyApplicationBeforeRender(newBody, options) {
        return dispatch("turbo:before-render", {
            detail: Object.assign({ newBody }, options),
            cancelable: true,
        });
    }
    notifyApplicationAfterRender() {
        return dispatch("turbo:render");
    }
    notifyApplicationAfterPageLoad(timing = {}) {
        return dispatch("turbo:load", {
            detail: { url: this.location.href, timing },
        });
    }
    notifyApplicationAfterVisitingSamePageLocation(oldURL, newURL) {
        dispatchEvent(new HashChangeEvent("hashchange", {
            oldURL: oldURL.toString(),
            newURL: newURL.toString(),
        }));
    }
    notifyApplicationAfterFrameLoad(frame) {
        return dispatch("turbo:frame-load", { target: frame });
    }
    notifyApplicationAfterFrameRender(fetchResponse, frame) {
        return dispatch("turbo:frame-render", {
            detail: { fetchResponse },
            target: frame,
            cancelable: true,
        });
    }
    submissionIsNavigatable(form, submitter) {
        if (this.formMode == "off") {
            return false;
        }
        else {
            const submitterIsNavigatable = submitter ? this.elementIsNavigatable(submitter) : true;
            if (this.formMode == "optin") {
                return submitterIsNavigatable && form.closest('[data-turbo="true"]') != null;
            }
            else {
                return submitterIsNavigatable && this.elementIsNavigatable(form);
            }
        }
    }
    elementIsNavigatable(element) {
        const container = findClosestRecursively(element, "[data-turbo]");
        const withinFrame = findClosestRecursively(element, "turbo-frame");
        if (this.drive || withinFrame) {
            if (container) {
                return container.getAttribute("data-turbo") != "false";
            }
            else {
                return true;
            }
        }
        else {
            if (container) {
                return container.getAttribute("data-turbo") == "true";
            }
            else {
                return false;
            }
        }
    }
    getActionForLink(link) {
        return getVisitAction(link) || "advance";
    }
    get snapshot() {
        return this.view.snapshot;
    }
}
function extendURLWithDeprecatedProperties(url) {
    Object.defineProperties(url, deprecatedLocationPropertyDescriptors);
}
const deprecatedLocationPropertyDescriptors = {
    absoluteURL: {
        get() {
            return this.toString();
        },
    },
};

class Cache {
    constructor(session) {
        this.session = session;
    }
    clear() {
        this.session.clearCache();
    }
    resetCacheControl() {
        this.setCacheControl("");
    }
    exemptPageFromCache() {
        this.setCacheControl("no-cache");
    }
    exemptPageFromPreview() {
        this.setCacheControl("no-preview");
    }
    setCacheControl(value) {
        setMetaContent("turbo-cache-control", value);
    }
}

const StreamActions = {
    after() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e.nextSibling); });
    },
    append() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.append(this.templateContent));
    },
    before() {
        this.targetElements.forEach((e) => { var _a; return (_a = e.parentElement) === null || _a === void 0 ? void 0 : _a.insertBefore(this.templateContent, e); });
    },
    prepend() {
        this.removeDuplicateTargetChildren();
        this.targetElements.forEach((e) => e.prepend(this.templateContent));
    },
    remove() {
        this.targetElements.forEach((e) => e.remove());
    },
    replace() {
        this.targetElements.forEach((e) => e.replaceWith(this.templateContent));
    },
    update() {
        this.targetElements.forEach((targetElement) => {
            targetElement.innerHTML = "";
            targetElement.append(this.templateContent);
        });
    },
};

const session = new Session();
const cache = new Cache(session);
const { navigator: navigator$1 } = session;
function start() {
    session.start();
}
function registerAdapter(adapter) {
    session.registerAdapter(adapter);
}
function visit(location, options) {
    session.visit(location, options);
}
function connectStreamSource(source) {
    session.connectStreamSource(source);
}
function disconnectStreamSource(source) {
    session.disconnectStreamSource(source);
}
function renderStreamMessage(message) {
    session.renderStreamMessage(message);
}
function clearCache() {
    console.warn("Please replace `Turbo.clearCache()` with `Turbo.cache.clear()`. The top-level function is deprecated and will be removed in a future version of Turbo.`");
    session.clearCache();
}
function setProgressBarDelay(delay) {
    session.setProgressBarDelay(delay);
}
function setConfirmMethod(confirmMethod) {
    FormSubmission.confirmMethod = confirmMethod;
}
function setFormMode(mode) {
    session.setFormMode(mode);
}

var Turbo = /*#__PURE__*/Object.freeze({
    __proto__: null,
    navigator: navigator$1,
    session: session,
    cache: cache,
    PageRenderer: PageRenderer,
    PageSnapshot: PageSnapshot,
    FrameRenderer: FrameRenderer,
    start: start,
    registerAdapter: registerAdapter,
    visit: visit,
    connectStreamSource: connectStreamSource,
    disconnectStreamSource: disconnectStreamSource,
    renderStreamMessage: renderStreamMessage,
    clearCache: clearCache,
    setProgressBarDelay: setProgressBarDelay,
    setConfirmMethod: setConfirmMethod,
    setFormMode: setFormMode,
    StreamActions: StreamActions
});

class TurboFrameMissingError extends Error {
}

class FrameController {
    constructor(element) {
        this.fetchResponseLoaded = (_fetchResponse) => { };
        this.currentFetchRequest = null;
        this.resolveVisitPromise = () => { };
        this.connected = false;
        this.hasBeenLoaded = false;
        this.ignoredAttributes = new Set();
        this.action = null;
        this.visitCachedSnapshot = ({ element }) => {
            const frame = element.querySelector("#" + this.element.id);
            if (frame && this.previousFrameElement) {
                frame.replaceChildren(...this.previousFrameElement.children);
            }
            delete this.previousFrameElement;
        };
        this.element = element;
        this.view = new FrameView(this, this.element);
        this.appearanceObserver = new AppearanceObserver(this, this.element);
        this.formLinkClickObserver = new FormLinkClickObserver(this, this.element);
        this.linkInterceptor = new LinkInterceptor(this, this.element);
        this.restorationIdentifier = uuid();
        this.formSubmitObserver = new FormSubmitObserver(this, this.element);
    }
    connect() {
        if (!this.connected) {
            this.connected = true;
            if (this.loadingStyle == FrameLoadingStyle.lazy) {
                this.appearanceObserver.start();
            }
            else {
                this.loadSourceURL();
            }
            this.formLinkClickObserver.start();
            this.linkInterceptor.start();
            this.formSubmitObserver.start();
        }
    }
    disconnect() {
        if (this.connected) {
            this.connected = false;
            this.appearanceObserver.stop();
            this.formLinkClickObserver.stop();
            this.linkInterceptor.stop();
            this.formSubmitObserver.stop();
        }
    }
    disabledChanged() {
        if (this.loadingStyle == FrameLoadingStyle.eager) {
            this.loadSourceURL();
        }
    }
    sourceURLChanged() {
        if (this.isIgnoringChangesTo("src"))
            return;
        if (this.element.isConnected) {
            this.complete = false;
        }
        if (this.loadingStyle == FrameLoadingStyle.eager || this.hasBeenLoaded) {
            this.loadSourceURL();
        }
    }
    sourceURLReloaded() {
        const { src } = this.element;
        this.ignoringChangesToAttribute("complete", () => {
            this.element.removeAttribute("complete");
        });
        this.element.src = null;
        this.element.src = src;
        return this.element.loaded;
    }
    completeChanged() {
        if (this.isIgnoringChangesTo("complete"))
            return;
        this.loadSourceURL();
    }
    loadingStyleChanged() {
        if (this.loadingStyle == FrameLoadingStyle.lazy) {
            this.appearanceObserver.start();
        }
        else {
            this.appearanceObserver.stop();
            this.loadSourceURL();
        }
    }
    async loadSourceURL() {
        if (this.enabled && this.isActive && !this.complete && this.sourceURL) {
            this.element.loaded = this.visit(expandURL(this.sourceURL));
            this.appearanceObserver.stop();
            await this.element.loaded;
            this.hasBeenLoaded = true;
        }
    }
    async loadResponse(fetchResponse) {
        if (fetchResponse.redirected || (fetchResponse.succeeded && fetchResponse.isHTML)) {
            this.sourceURL = fetchResponse.response.url;
        }
        try {
            const html = await fetchResponse.responseHTML;
            if (html) {
                const document = parseHTMLDocument(html);
                const pageSnapshot = PageSnapshot.fromDocument(document);
                if (pageSnapshot.isVisitable) {
                    await this.loadFrameResponse(fetchResponse, document);
                }
                else {
                    await this.handleUnvisitableFrameResponse(fetchResponse);
                }
            }
        }
        finally {
            this.fetchResponseLoaded = () => { };
        }
    }
    elementAppearedInViewport(element) {
        this.proposeVisitIfNavigatedWithAction(element, element);
        this.loadSourceURL();
    }
    willSubmitFormLinkToLocation(link) {
        return this.shouldInterceptNavigation(link);
    }
    submittedFormLinkToLocation(link, _location, form) {
        const frame = this.findFrameElement(link);
        if (frame)
            form.setAttribute("data-turbo-frame", frame.id);
    }
    shouldInterceptLinkClick(element, _location, _event) {
        return this.shouldInterceptNavigation(element);
    }
    linkClickIntercepted(element, location) {
        this.navigateFrame(element, location);
    }
    willSubmitForm(element, submitter) {
        return element.closest("turbo-frame") == this.element && this.shouldInterceptNavigation(element, submitter);
    }
    formSubmitted(element, submitter) {
        if (this.formSubmission) {
            this.formSubmission.stop();
        }
        this.formSubmission = new FormSubmission(this, element, submitter);
        const { fetchRequest } = this.formSubmission;
        this.prepareRequest(fetchRequest);
        this.formSubmission.start();
    }
    prepareRequest(request) {
        var _a;
        request.headers["Turbo-Frame"] = this.id;
        if ((_a = this.currentNavigationElement) === null || _a === void 0 ? void 0 : _a.hasAttribute("data-turbo-stream")) {
            request.acceptResponseType(StreamMessage.contentType);
        }
    }
    requestStarted(_request) {
        markAsBusy(this.element);
    }
    requestPreventedHandlingResponse(_request, _response) {
        this.resolveVisitPromise();
    }
    async requestSucceededWithResponse(request, response) {
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    async requestFailedWithResponse(request, response) {
        await this.loadResponse(response);
        this.resolveVisitPromise();
    }
    requestErrored(request, error) {
        console.error(error);
        this.resolveVisitPromise();
    }
    requestFinished(_request) {
        clearBusyState(this.element);
    }
    formSubmissionStarted({ formElement }) {
        markAsBusy(formElement, this.findFrameElement(formElement));
    }
    formSubmissionSucceededWithResponse(formSubmission, response) {
        const frame = this.findFrameElement(formSubmission.formElement, formSubmission.submitter);
        frame.delegate.proposeVisitIfNavigatedWithAction(frame, formSubmission.formElement, formSubmission.submitter);
        frame.delegate.loadResponse(response);
        if (!formSubmission.isSafe) {
            session.clearCache();
        }
    }
    formSubmissionFailedWithResponse(formSubmission, fetchResponse) {
        this.element.delegate.loadResponse(fetchResponse);
        session.clearCache();
    }
    formSubmissionErrored(formSubmission, error) {
        console.error(error);
    }
    formSubmissionFinished({ formElement }) {
        clearBusyState(formElement, this.findFrameElement(formElement));
    }
    allowsImmediateRender({ element: newFrame }, options) {
        const event = dispatch("turbo:before-frame-render", {
            target: this.element,
            detail: Object.assign({ newFrame }, options),
            cancelable: true,
        });
        const { defaultPrevented, detail: { render }, } = event;
        if (this.view.renderer && render) {
            this.view.renderer.renderElement = render;
        }
        return !defaultPrevented;
    }
    viewRenderedSnapshot(_snapshot, _isPreview) { }
    preloadOnLoadLinksForView(element) {
        session.preloadOnLoadLinksForView(element);
    }
    viewInvalidated() { }
    willRenderFrame(currentElement, _newElement) {
        this.previousFrameElement = currentElement.cloneNode(true);
    }
    async loadFrameResponse(fetchResponse, document) {
        const newFrameElement = await this.extractForeignFrameElement(document.body);
        if (newFrameElement) {
            const snapshot = new Snapshot(newFrameElement);
            const renderer = new FrameRenderer(this, this.view.snapshot, snapshot, FrameRenderer.renderElement, false, false);
            if (this.view.renderPromise)
                await this.view.renderPromise;
            this.changeHistory();
            await this.view.render(renderer);
            this.complete = true;
            session.frameRendered(fetchResponse, this.element);
            session.frameLoaded(this.element);
            this.fetchResponseLoaded(fetchResponse);
        }
        else if (this.willHandleFrameMissingFromResponse(fetchResponse)) {
            this.handleFrameMissingFromResponse(fetchResponse);
        }
    }
    async visit(url) {
        var _a;
        const request = new FetchRequest(this, FetchMethod.get, url, new URLSearchParams(), this.element);
        (_a = this.currentFetchRequest) === null || _a === void 0 ? void 0 : _a.cancel();
        this.currentFetchRequest = request;
        return new Promise((resolve) => {
            this.resolveVisitPromise = () => {
                this.resolveVisitPromise = () => { };
                this.currentFetchRequest = null;
                resolve();
            };
            request.perform();
        });
    }
    navigateFrame(element, url, submitter) {
        const frame = this.findFrameElement(element, submitter);
        frame.delegate.proposeVisitIfNavigatedWithAction(frame, element, submitter);
        this.withCurrentNavigationElement(element, () => {
            frame.src = url;
        });
    }
    proposeVisitIfNavigatedWithAction(frame, element, submitter) {
        this.action = getVisitAction(submitter, element, frame);
        if (this.action) {
            const pageSnapshot = PageSnapshot.fromElement(frame).clone();
            const { visitCachedSnapshot } = frame.delegate;
            frame.delegate.fetchResponseLoaded = (fetchResponse) => {
                if (frame.src) {
                    const { statusCode, redirected } = fetchResponse;
                    const responseHTML = frame.ownerDocument.documentElement.outerHTML;
                    const response = { statusCode, redirected, responseHTML };
                    const options = {
                        response,
                        visitCachedSnapshot,
                        willRender: false,
                        updateHistory: false,
                        restorationIdentifier: this.restorationIdentifier,
                        snapshot: pageSnapshot,
                    };
                    if (this.action)
                        options.action = this.action;
                    session.visit(frame.src, options);
                }
            };
        }
    }
    changeHistory() {
        if (this.action) {
            const method = getHistoryMethodForAction(this.action);
            session.history.update(method, expandURL(this.element.src || ""), this.restorationIdentifier);
        }
    }
    async handleUnvisitableFrameResponse(fetchResponse) {
        console.warn(`The response (${fetchResponse.statusCode}) from <turbo-frame id="${this.element.id}"> is performing a full page visit due to turbo-visit-control.`);
        await this.visitResponse(fetchResponse.response);
    }
    willHandleFrameMissingFromResponse(fetchResponse) {
        this.element.setAttribute("complete", "");
        const response = fetchResponse.response;
        const visit = async (url, options = {}) => {
            if (url instanceof Response) {
                this.visitResponse(url);
            }
            else {
                session.visit(url, options);
            }
        };
        const event = dispatch("turbo:frame-missing", {
            target: this.element,
            detail: { response, visit },
            cancelable: true,
        });
        return !event.defaultPrevented;
    }
    handleFrameMissingFromResponse(fetchResponse) {
        this.view.missing();
        this.throwFrameMissingError(fetchResponse);
    }
    throwFrameMissingError(fetchResponse) {
        const message = `The response (${fetchResponse.statusCode}) did not contain the expected <turbo-frame id="${this.element.id}"> and will be ignored. To perform a full page visit instead, set turbo-visit-control to reload.`;
        throw new TurboFrameMissingError(message);
    }
    async visitResponse(response) {
        const wrapped = new FetchResponse(response);
        const responseHTML = await wrapped.responseHTML;
        const { location, redirected, statusCode } = wrapped;
        return session.visit(location, { response: { redirected, statusCode, responseHTML } });
    }
    findFrameElement(element, submitter) {
        var _a;
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        return (_a = getFrameElementById(id)) !== null && _a !== void 0 ? _a : this.element;
    }
    async extractForeignFrameElement(container) {
        let element;
        const id = CSS.escape(this.id);
        try {
            element = activateElement(container.querySelector(`turbo-frame#${id}`), this.sourceURL);
            if (element) {
                return element;
            }
            element = activateElement(container.querySelector(`turbo-frame[src][recurse~=${id}]`), this.sourceURL);
            if (element) {
                await element.loaded;
                return await this.extractForeignFrameElement(element);
            }
        }
        catch (error) {
            console.error(error);
            return new FrameElement();
        }
        return null;
    }
    formActionIsVisitable(form, submitter) {
        const action = getAction(form, submitter);
        return locationIsVisitable(expandURL(action), this.rootLocation);
    }
    shouldInterceptNavigation(element, submitter) {
        const id = getAttribute("data-turbo-frame", submitter, element) || this.element.getAttribute("target");
        if (element instanceof HTMLFormElement && !this.formActionIsVisitable(element, submitter)) {
            return false;
        }
        if (!this.enabled || id == "_top") {
            return false;
        }
        if (id) {
            const frameElement = getFrameElementById(id);
            if (frameElement) {
                return !frameElement.disabled;
            }
        }
        if (!session.elementIsNavigatable(element)) {
            return false;
        }
        if (submitter && !session.elementIsNavigatable(submitter)) {
            return false;
        }
        return true;
    }
    get id() {
        return this.element.id;
    }
    get enabled() {
        return !this.element.disabled;
    }
    get sourceURL() {
        if (this.element.src) {
            return this.element.src;
        }
    }
    set sourceURL(sourceURL) {
        this.ignoringChangesToAttribute("src", () => {
            this.element.src = sourceURL !== null && sourceURL !== void 0 ? sourceURL : null;
        });
    }
    get loadingStyle() {
        return this.element.loading;
    }
    get isLoading() {
        return this.formSubmission !== undefined || this.resolveVisitPromise() !== undefined;
    }
    get complete() {
        return this.element.hasAttribute("complete");
    }
    set complete(value) {
        this.ignoringChangesToAttribute("complete", () => {
            if (value) {
                this.element.setAttribute("complete", "");
            }
            else {
                this.element.removeAttribute("complete");
            }
        });
    }
    get isActive() {
        return this.element.isActive && this.connected;
    }
    get rootLocation() {
        var _a;
        const meta = this.element.ownerDocument.querySelector(`meta[name="turbo-root"]`);
        const root = (_a = meta === null || meta === void 0 ? void 0 : meta.content) !== null && _a !== void 0 ? _a : "/";
        return expandURL(root);
    }
    isIgnoringChangesTo(attributeName) {
        return this.ignoredAttributes.has(attributeName);
    }
    ignoringChangesToAttribute(attributeName, callback) {
        this.ignoredAttributes.add(attributeName);
        callback();
        this.ignoredAttributes.delete(attributeName);
    }
    withCurrentNavigationElement(element, callback) {
        this.currentNavigationElement = element;
        callback();
        delete this.currentNavigationElement;
    }
}
function getFrameElementById(id) {
    if (id != null) {
        const element = document.getElementById(id);
        if (element instanceof FrameElement) {
            return element;
        }
    }
}
function activateElement(element, currentURL) {
    if (element) {
        const src = element.getAttribute("src");
        if (src != null && currentURL != null && urlsAreEqual(src, currentURL)) {
            throw new Error(`Matching <turbo-frame id="${element.id}"> element has a source URL which references itself`);
        }
        if (element.ownerDocument !== document) {
            element = document.importNode(element, true);
        }
        if (element instanceof FrameElement) {
            element.connectedCallback();
            element.disconnectedCallback();
            return element;
        }
    }
}

class StreamElement extends HTMLElement {
    static async renderElement(newElement) {
        await newElement.performAction();
    }
    async connectedCallback() {
        try {
            await this.render();
        }
        catch (error) {
            console.error(error);
        }
        finally {
            this.disconnect();
        }
    }
    async render() {
        var _a;
        return ((_a = this.renderPromise) !== null && _a !== void 0 ? _a : (this.renderPromise = (async () => {
            const event = this.beforeRenderEvent;
            if (this.dispatchEvent(event)) {
                await nextAnimationFrame();
                await event.detail.render(this);
            }
        })()));
    }
    disconnect() {
        try {
            this.remove();
        }
        catch (_a) { }
    }
    removeDuplicateTargetChildren() {
        this.duplicateChildren.forEach((c) => c.remove());
    }
    get duplicateChildren() {
        var _a;
        const existingChildren = this.targetElements.flatMap((e) => [...e.children]).filter((c) => !!c.id);
        const newChildrenIds = [...(((_a = this.templateContent) === null || _a === void 0 ? void 0 : _a.children) || [])].filter((c) => !!c.id).map((c) => c.id);
        return existingChildren.filter((c) => newChildrenIds.includes(c.id));
    }
    get performAction() {
        if (this.action) {
            const actionFunction = StreamActions[this.action];
            if (actionFunction) {
                return actionFunction;
            }
            this.raise("unknown action");
        }
        this.raise("action attribute is missing");
    }
    get targetElements() {
        if (this.target) {
            return this.targetElementsById;
        }
        else if (this.targets) {
            return this.targetElementsByQuery;
        }
        else {
            this.raise("target or targets attribute is missing");
        }
    }
    get templateContent() {
        return this.templateElement.content.cloneNode(true);
    }
    get templateElement() {
        if (this.firstElementChild === null) {
            const template = this.ownerDocument.createElement("template");
            this.appendChild(template);
            return template;
        }
        else if (this.firstElementChild instanceof HTMLTemplateElement) {
            return this.firstElementChild;
        }
        this.raise("first child element must be a <template> element");
    }
    get action() {
        return this.getAttribute("action");
    }
    get target() {
        return this.getAttribute("target");
    }
    get targets() {
        return this.getAttribute("targets");
    }
    raise(message) {
        throw new Error(`${this.description}: ${message}`);
    }
    get description() {
        var _a, _b;
        return (_b = ((_a = this.outerHTML.match(/<[^>]+>/)) !== null && _a !== void 0 ? _a : [])[0]) !== null && _b !== void 0 ? _b : "<turbo-stream>";
    }
    get beforeRenderEvent() {
        return new CustomEvent("turbo:before-stream-render", {
            bubbles: true,
            cancelable: true,
            detail: { newStream: this, render: StreamElement.renderElement },
        });
    }
    get targetElementsById() {
        var _a;
        const element = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.getElementById(this.target);
        if (element !== null) {
            return [element];
        }
        else {
            return [];
        }
    }
    get targetElementsByQuery() {
        var _a;
        const elements = (_a = this.ownerDocument) === null || _a === void 0 ? void 0 : _a.querySelectorAll(this.targets);
        if (elements.length !== 0) {
            return Array.prototype.slice.call(elements);
        }
        else {
            return [];
        }
    }
}

class StreamSourceElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.streamSource = null;
    }
    connectedCallback() {
        this.streamSource = this.src.match(/^ws{1,2}:/) ? new WebSocket(this.src) : new EventSource(this.src);
        connectStreamSource(this.streamSource);
    }
    disconnectedCallback() {
        if (this.streamSource) {
            disconnectStreamSource(this.streamSource);
        }
    }
    get src() {
        return this.getAttribute("src") || "";
    }
}

FrameElement.delegateConstructor = FrameController;
if (customElements.get("turbo-frame") === undefined) {
    customElements.define("turbo-frame", FrameElement);
}
if (customElements.get("turbo-stream") === undefined) {
    customElements.define("turbo-stream", StreamElement);
}
if (customElements.get("turbo-stream-source") === undefined) {
    customElements.define("turbo-stream-source", StreamSourceElement);
}

(() => {
    let element = document.currentScript;
    if (!element)
        return;
    if (element.hasAttribute("data-turbo-suppress-warning"))
        return;
    element = element.parentElement;
    while (element) {
        if (element == document.body) {
            return console.warn(unindent `
        You are loading Turbo from a <script> element inside the <body> element. This is probably not what you meant to do!

        Load your application’s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.

        For more information, see: https://turbo.hotwired.dev/handbook/building#working-with-script-elements

        ——
        Suppress this warning by adding a "data-turbo-suppress-warning" attribute to: %s
      `, element.outerHTML);
        }
        element = element.parentElement;
    }
})();

window.Turbo = Turbo;
start();




/***/ }),

/***/ "./node_modules/jsrender/jsrender.js":
/*!*******************************************!*\
  !*** ./node_modules/jsrender/jsrender.js ***!
  \*******************************************/
/***/ ((module) => {

/*! JsRender v1.0.14: http://jsviews.com/#jsrender */
/*! **VERSION FOR WEB** (For NODE.JS see http://jsviews.com/download/jsrender-node.js) */
/*
 * Best-of-breed templating in browser or on Node.js.
 * Does not require jQuery, or HTML DOM
 * Integrates with JsViews (http://jsviews.com/#jsviews)
 *
 * Copyright 2024, Boris Moore
 * Released under the MIT License.
 */

//jshint -W018, -W041, -W120

(function(factory, global) {
	// global var is the this object, which is window when running in the usual browser environment
	var $ = global.jQuery;

	if (true) { // CommonJS e.g. Browserify
		module.exports = $
			? factory(global, $)
			: function($) { // If no global jQuery, take optional jQuery passed as parameter: require('jsrender')(jQuery)
				if ($ && !$.fn) {
					throw "Provide jQuery or null";
				}
				return factory(global, $);
			};
	} else {}
} (

// factory (for jsrender.js)
function(global, $) {
"use strict";

//========================== Top-level vars ==========================

// global var is the this object, which is window when running in the usual browser environment
var setGlobals = $ === false; // Only set globals if script block in browser (not AMD and not CommonJS)

$ = $ && $.fn ? $ : global.jQuery; // $ is jQuery passed in by CommonJS loader (Browserify), or global jQuery.

var versionNumber = "v1.0.14",
	jsvStoreName, rTag, rTmplString, topView, $views, $expando,
	_ocp = "_ocp",      // Observable contextual parameter

	$isFunction, $isArray, $templates, $converters, $helpers, $tags, $sub, $subSettings, $subSettingsAdvanced, $viewsSettings,
	delimOpenChar0, delimOpenChar1, delimCloseChar0, delimCloseChar1, linkChar, setting, baseOnError,

	isRenderCall,
	rNewLine = /[ \t]*(\r\n|\n|\r)/g,
	rUnescapeQuotes = /\\(['"\\])/g, // Unescape quotes and trim
	rEscapeQuotes = /['"\\]/g, // Escape quotes and \ character
	rBuildHash = /(?:\x08|^)(onerror:)?(?:(~?)(([\w$.]+):)?([^\x08]+))\x08(,)?([^\x08]+)/gi,
	rTestElseIf = /^if\s/,
	rFirstElem = /<(\w+)[>\s]/,
	rAttrEncode = /[\x00`><"'&=]/g, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
	rIsHtml = /[\x00`><\"'&=]/,
	rHasHandlers = /^on[A-Z]|^convert(Back)?$/,
	rWrappedInViewMarker = /^\#\d+_`[\s\S]*\/\d+_`$/,
	rHtmlEncode = rAttrEncode,
	rDataEncode = /[&<>]/g,
	rDataUnencode = /&(amp|gt|lt);/g,
	rBracketQuote = /\[['"]?|['"]?\]/g,
	viewId = 0,
	charEntities = {
		"&": "&amp;",
		"<": "&lt;",
		">": "&gt;",
		"\x00": "&#0;",
		"'": "&#39;",
		'"': "&#34;",
		"`": "&#96;",
		"=": "&#61;"
	},
	charsFromEntities = {
		amp: "&",
		gt: ">",
		lt: "<"
	},
	HTML = "html",
	STRING = "string",
	OBJECT = "object",
	tmplAttr = "data-jsv-tmpl",
	jsvTmpl = "jsvTmpl",
	indexStr = "For #index in nested block use #getIndex().",
	cpFnStore = {},     // Compiled furnctions for computed values in template expressions (properties, methods, helpers)
	$render = {},

	jsr = global.jsrender,
	jsrToJq = jsr && $ && !$.render, // JsRender already loaded, without jQuery. but we will re-load it now to attach to jQuery

	jsvStores = {
		template: {
			compile: compileTmpl
		},
		tag: {
			compile: compileTag
		},
		viewModel: {
			compile: compileViewModel
		},
		helper: {},
		converter: {}
	};

	// views object ($.views if jQuery is loaded, jsrender.views if no jQuery, e.g. in Node.js)
	$views = {
		jsviews: versionNumber,
		sub: {
			// subscription, e.g. JsViews integration
			rPath: /^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
			//        not                               object     helper    view  viewProperty pathTokens      leafToken

			rPrm: /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(~?[\w$.^]+)?\s*((\+\+|--)|\+|-|~(?![\w$])|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?(@)?[#~]?[\w$.^]+)([([])?)|(,\s*)|(?:(\()\s*)?\\?(?:(')|("))|(?:\s*(([)\]])(?=[.^]|\s*$|[^([])|[)\]])([([]?))|(\s+)/g,
			//   lftPrn0           lftPrn         bound     path               operator     err                                          eq      path2 late            prn      comma  lftPrn2          apos quot        rtPrn  rtPrnDot                  prn2     space

			View: View,
			Err: JsViewsError,
			tmplFn: tmplFn,
			parse: parseParams,
			extend: $extend,
			extendCtx: extendCtx,
			syntaxErr: syntaxError,
			onStore: {
				template: function(name, item) {
					if (item === null) {
						delete $render[name];
					} else if (name) {
						$render[name] = item;
					}
				}
			},
			addSetting: addSetting,
			settings: {
				allowCode: false
			},
			advSet: noop, // Update advanced settings
			_thp: tagHandlersFromProps,
			_gm: getMethod,
			_tg: function() {}, // Constructor for tagDef
			_cnvt: convertVal,
			_tag: renderTag,
			_er: error,
			_err: onRenderError,
			_cp: retVal, // Get observable contextual parameters (or properties) ~foo=expr. In JsRender, simply returns val.
			_sq: function(token) {
				if (token === "constructor") {
					syntaxError("");
				}
				return token;
			}
		},
		settings: {
			delimiters: $viewsDelimiters,
			advanced: function(value) {
				return value
					? (
							$extend($subSettingsAdvanced, value),
							$sub.advSet(),
							$viewsSettings
						)
						: $subSettingsAdvanced;
				}
		},
		map: dataMap // If jsObservable loaded first, use that definition of dataMap
	};

function getDerivedMethod(baseMethod, method) {
	return function() {
		var ret,
			tag = this,
			prevBase = tag.base;

		tag.base = baseMethod; // Within method call, calling this.base will call the base method
		ret = method.apply(tag, arguments); // Call the method
		tag.base = prevBase; // Replace this.base to be the base method of the previous call, for chained calls
		return ret;
	};
}

function getMethod(baseMethod, method) {
	// For derived methods (or handlers declared declaratively as in {{:foo onChange=~fooChanged}} replace by a derived method, to allow using this.base(...)
	// or this.baseApply(arguments) to call the base implementation. (Equivalent to this._super(...) and this._superApply(arguments) in jQuery UI)
	if ($isFunction(method)) {
		method = getDerivedMethod(
				!baseMethod
					? noop // no base method implementation, so use noop as base method
					: baseMethod._d
						? baseMethod // baseMethod is a derived method, so use it
						: getDerivedMethod(noop, baseMethod), // baseMethod is not derived so make its base method be the noop method
				method
			);
		method._d = (baseMethod && baseMethod._d || 0) + 1; // Add flag for derived method (incremented for derived of derived...)
	}
	return method;
}

function tagHandlersFromProps(tag, tagCtx) {
	var prop,
		props = tagCtx.props;
	for (prop in props) {
		if (rHasHandlers.test(prop) && !(tag[prop] && tag[prop].fix)) { // Don't override handlers with fix expando (used in datepicker and spinner)
			tag[prop] = prop !== "convert" ? getMethod(tag.constructor.prototype[prop], props[prop]) : props[prop];
			// Copy over the onFoo props, convert and convertBack from tagCtx.props to tag (overrides values in tagDef).
			// Note: unsupported scenario: if handlers are dynamically added ^onFoo=expression this will work, but dynamically removing will not work.
		}
	}
}

function retVal(val) {
	return val;
}

function noop() {
	return "";
}

function dbgBreak(val) {
	// Usage examples: {{dbg:...}}, {{:~dbg(...)}}, {{dbg .../}}, {^{for ... onAfterLink=~dbg}} etc.
	try {
		console.log("JsRender dbg breakpoint: " + val);
		throw "dbg breakpoint"; // To break here, stop on caught exceptions.
	}
	catch (e) {}
	return this.base ? this.baseApply(arguments) : val;
}

function JsViewsError(message) {
	// Error exception type for JsViews/JsRender
	// Override of $.views.sub.Error is possible
	this.name = ($.link ? "JsViews" : "JsRender") + " Error";
	this.message = message || this.name;
}

function $extend(target, source) {
	if (target) {
		for (var name in source) {
			target[name] = source[name];
		}
		return target;
	}
}

(JsViewsError.prototype = new Error()).constructor = JsViewsError;

//========================== Top-level functions ==========================

//===================
// views.delimiters
//===================

	/**
	* Set the tag opening and closing delimiters and 'link' character. Default is "{{", "}}" and "^"
	* openChars, closeChars: opening and closing strings, each with two characters
	* $.views.settings.delimiters(...)
	*
	* @param {string}   openChars
	* @param {string}   [closeChars]
	* @param {string}   [link]
	* @returns {Settings}
	*
	* Get delimiters
	* delimsArray = $.views.settings.delimiters()
	*
	* @returns {string[]}
	*/
function $viewsDelimiters(openChars, closeChars, link) {
	if (!openChars) {
		return $subSettings.delimiters;
	}
	if ($isArray(openChars)) {
		return $viewsDelimiters.apply($views, openChars);
	}
	linkChar = link ? link[0] : linkChar;
	if (!/^(\W|_){5}$/.test(openChars + closeChars + linkChar)) {
		error("Invalid delimiters"); // Must be non-word characters, and openChars and closeChars must each be length 2
	}
	delimOpenChar0 = openChars[0];
	delimOpenChar1 = openChars[1];
	delimCloseChar0 = closeChars[0];
	delimCloseChar1 = closeChars[1];

	$subSettings.delimiters = [delimOpenChar0 + delimOpenChar1, delimCloseChar0 + delimCloseChar1, linkChar];

	// Escape the characters - since they could be regex special characters
	openChars = "\\" + delimOpenChar0 + "(\\" + linkChar + ")?\\" + delimOpenChar1; // Default is "{^{"
	closeChars = "\\" + delimCloseChar0 + "\\" + delimCloseChar1;                   // Default is "}}"
	// Build regex with new delimiters
	//          [tag    (followed by / space or })  or cvtr+colon or html or code] followed by space+params then convertBack?
	rTag = "(?:(\\w+(?=[\\/\\s\\" + delimCloseChar0 + "]))|(\\w+)?(:)|(>)|(\\*))\\s*((?:[^\\"
		+ delimCloseChar0 + "]|\\" + delimCloseChar0 + "(?!\\" + delimCloseChar1 + "))*?)";

	// Make rTag available to JsViews (or other components) for parsing binding expressions
	$sub.rTag = "(?:" + rTag + ")";
	//                        { ^? {   tag+params slash?  or closingTag                                                   or comment
	rTag = new RegExp("(?:" + openChars + rTag + "(\\/)?|\\" + delimOpenChar0 + "(\\" + linkChar + ")?\\" + delimOpenChar1 + "(?:(?:\\/(\\w+))\\s*|!--[\\s\\S]*?--))" + closeChars, "g");

	// Default:  bind     tagName         cvt   cln html code    params            slash   bind2         closeBlk  comment
	//      /(?:{(\^)?{(?:(\w+(?=[\/\s}]))|(\w+)?(:)|(>)|(\*))\s*((?:[^}]|}(?!}))*?)(\/)?|{(\^)?{(?:(?:\/(\w+))\s*|!--[\s\S]*?--))}}

	$sub.rTmpl = new RegExp("^\\s|\\s$|<.*>|([^\\\\]|^)[{}]|" + openChars + ".*" + closeChars);
	// $sub.rTmpl looks for initial or final white space, html tags or { or } char not preceded by \\, or JsRender tags {{xxx}}.
	// Each of these strings are considered NOT to be jQuery selectors
	return $viewsSettings;
}

//=========
// View.get
//=========

function getView(inner, type) { //view.get(inner, type)
	if (!type && inner !== true) {
		// view.get(type)
		type = inner;
		inner = undefined;
	}

	var views, i, l, found,
		view = this,
		root = type === "root";
		// view.get("root") returns view.root, view.get() returns view.parent, view.get(true) returns view.views[0].

	if (inner) {
		// Go through views - this one, and all nested ones, depth-first - and return first one with given type.
		// If type is undefined, i.e. view.get(true), return first child view.
		found = type && view.type === type && view;
		if (!found) {
			views = view.views;
			if (view._.useKey) {
				for (i in views) {
					if (found = type ? views[i].get(inner, type) : views[i]) {
						break;
					}
				}
			} else {
				for (i = 0, l = views.length; !found && i < l; i++) {
					found = type ? views[i].get(inner, type) : views[i];
				}
			}
		}
	} else if (root) {
		// Find root view. (view whose parent is top view)
		found = view.root;
	} else if (type) {
		while (view && !found) {
			// Go through views - this one, and all parent ones - and return first one with given type.
			found = view.type === type ? view : undefined;
			view = view.parent;
		}
	} else {
		found = view.parent;
	}
	return found || undefined;
}

function getNestedIndex() {
	var view = this.get("item");
	return view ? view.index : undefined;
}

getNestedIndex.depends = function() {
	return [this.get("item"), "index"];
};

function getIndex() {
	return this.index;
}

getIndex.depends = "index";

//==================
// View.ctxPrm, etc.
//==================

/* Internal private: view._getOb() */
function getPathObject(ob, path, ltOb, fn) {
	// Iterate through path to late paths: @a.b.c paths
	// Return "" (or noop if leaf is a function @a.b.c(...) ) if intermediate object not yet available
	var prevOb, tokens, l,
		i = 0;
	if (ltOb === 1) {
		fn = 1;
		ltOb = undefined;
	}
	// Paths like ^a^b^c or ~^a^b^c will not throw if an object in path is undefined.
	if (path) {
		tokens = path.split(".");
		l = tokens.length;

		for (; ob && i < l; i++) {
			prevOb = ob;
			ob = tokens[i] ? ob[tokens[i]] : ob;
		}
	}
	if (ltOb) {
		ltOb.lt = ltOb.lt || i<l; // If i < l there was an object in the path not yet available
	}
	return ob === undefined
		? fn ? noop : ""
		: fn ? function() {
			return ob.apply(prevOb, arguments);
		} : ob;
}

function contextParameter(key, value, get) {
	// Helper method called as view.ctxPrm(key) for helpers or template parameters ~foo - from compiled template or from context callback
	var wrapped, deps, res, obsCtxPrm, tagElse, callView, newRes,
		storeView = this,
		isUpdate = !isRenderCall && arguments.length > 1,
		store = storeView.ctx;
	if (key) {
		if (!storeView._) { // tagCtx.ctxPrm() call
			tagElse = storeView.index;
			storeView = storeView.tag;
		}
		callView = storeView;
		if (store && store.hasOwnProperty(key) || (store = $helpers).hasOwnProperty(key)) {
			res = store[key];
			if (key === "tag" || key === "tagCtx" || key === "root" || key === "parentTags") {
				return res;
			}
		} else {
			store = undefined;
		}
		if (!isRenderCall && storeView.tagCtx || storeView.linked) { // Data-linked view, or tag instance
			if (!res || !res._cxp) {
				// Not a contextual parameter
				// Set storeView to tag (if this is a tag.ctxPrm() call) or to root view ("data" view of linked template)
				storeView = storeView.tagCtx || $isFunction(res)
					? storeView // Is a tag, not a view, or is a computed contextual parameter, so scope to the callView, not the 'scope view'
					: (storeView = storeView.scope || storeView,
						!storeView.isTop && storeView.ctx.tag // If this view is in a tag, set storeView to the tag
							|| storeView);
				if (res !== undefined && storeView.tagCtx) {
					// If storeView is a tag, but the contextual parameter has been set at at higher level (e.g. helpers)...
					storeView = storeView.tagCtx.view.scope; // then move storeView to the outer level (scope of tag container view)
				}
				store = storeView._ocps;
				res = store && store.hasOwnProperty(key) && store[key] || res;
				if (!(res && res._cxp) && (get || isUpdate)) {
					// Create observable contextual parameter
					(store || (storeView._ocps = storeView._ocps || {}))[key]
						= res
						= [{
							_ocp: res, // The observable contextual parameter value
							_vw: callView,
							_key: key
						}];
					res._cxp = {
						path: _ocp,
						ind: 0,
						updateValue: function(val, path) {
							$.observable(res[0]).setProperty(_ocp, val); // Set the value (res[0]._ocp)
							return this;
						}
					};
				}
			}
			if (obsCtxPrm = res && res._cxp) {
				// If this helper resource is an observable contextual parameter
				if (arguments.length > 2) {
					deps = res[1] ? $sub._ceo(res[1].deps) : [_ocp]; // fn deps (with any exprObs cloned using $sub._ceo)
					deps.unshift(res[0]); // view
					deps._cxp = obsCtxPrm;
					// In a context callback for a contextual param, we set get = true, to get ctxPrm [view, dependencies...] array - needed for observe call
					return deps;
				}
				tagElse = obsCtxPrm.tagElse;
				newRes = res[1] // linkFn for compiled expression
					? obsCtxPrm.tag && obsCtxPrm.tag.cvtArgs
						? obsCtxPrm.tag.cvtArgs(tagElse, 1)[obsCtxPrm.ind] // = tag.bndArgs() - for tag contextual parameter
						: res[1](res[0].data, res[0], $sub) // = fn(data, view, $sub) for compiled binding expression
					: res[0]._ocp; // Observable contextual parameter (uninitialized, or initialized as static expression, so no path dependencies)
				if (isUpdate) {
					$sub._ucp(key, value, storeView, obsCtxPrm); // Update observable contextual parameter
					return storeView;
				}
				res = newRes;
			}
		}
		if (res && $isFunction(res)) {
			// If a helper is of type function we will wrap it, so if called with no this pointer it will be called with the
			// view as 'this' context. If the helper ~foo() was in a data-link expression, the view will have a 'temporary' linkCtx property too.
			// Note that helper functions on deeper paths will have specific this pointers, from the preceding path.
			// For example, ~util.foo() will have the ~util object as 'this' pointer
			wrapped = function() {
				return res.apply((!this || this === global) ? callView : this, arguments);
			};
			$extend(wrapped, res); // Attach same expandos (if any) to the wrapped function
		}
		return wrapped || res;
	}
}

/* Internal private: view._getTmpl() */
function getTemplate(tmpl) {
	return tmpl && (tmpl.fn
		? tmpl
		: this.getRsc("templates", tmpl) || $templates(tmpl)); // not yet compiled
}

//==============
// views._cnvt
//==============

function convertVal(converter, view, tagCtx, onError) {
	// Called from compiled template code for {{:}}
	// self is template object or linkCtx object
	var tag, linkCtx, value, argsLen, bindTo,
		// If tagCtx is an integer, then it is the key for the compiled function to return the boundTag tagCtx
		boundTag = typeof tagCtx === "number" && view.tmpl.bnds[tagCtx-1];

	if (onError === undefined && boundTag && boundTag._lr) { // lateRender
		onError = "";
	}
	if (onError !== undefined) {
		tagCtx = onError = {props: {}, args: [onError]};
	} else if (boundTag) {
		tagCtx = boundTag(view.data, view, $sub);
	}
	boundTag = boundTag._bd && boundTag;
	if (converter || boundTag) {
		linkCtx = view._lc; // For data-link="{cvt:...}"... See onDataLinkedTagChange
		tag = linkCtx && linkCtx.tag;
		tagCtx.view = view;
		if (!tag) {
			tag = $extend(new $sub._tg(), {
				_: {
					bnd: boundTag,
					unlinked: true,
					lt: tagCtx.lt // If a late path @some.path has not returned @some object, mark tag as late
				},
				inline: !linkCtx,
				tagName: ":",
				convert: converter,
				onArrayChange: true,
				flow: true,
				tagCtx: tagCtx,
				tagCtxs: [tagCtx],
				_is: "tag"
			});
			argsLen = tagCtx.args.length;
			if (argsLen>1) {
				bindTo = tag.bindTo = [];
				while (argsLen--) {
					bindTo.unshift(argsLen); // Bind to all the arguments - generate bindTo array: [0,1,2...]
				}
			}
			if (linkCtx) {
				linkCtx.tag = tag;
				tag.linkCtx = linkCtx;
			}
			tagCtx.ctx = extendCtx(tagCtx.ctx, (linkCtx ? linkCtx.view : view).ctx);
			tagHandlersFromProps(tag, tagCtx);
		}
		tag._er = onError && value;
		tag.ctx = tagCtx.ctx || tag.ctx || {};
		tagCtx.ctx = undefined;
		value = tag.cvtArgs()[0]; // If there is a convertBack but no convert, converter will be "true"
		tag._er = onError && value;
	} else {
		value = tagCtx.args[0];
	}

	// Call onRender (used by JsViews if present, to add binding annotations around rendered content)
	value = boundTag && view._.onRender
		? view._.onRender(value, view, tag)
		: value;
	return value != undefined ? value : "";
}

function convertArgs(tagElse, bound) { // tag.cvtArgs() or tag.cvtArgs(tagElse?, true?)
	var l, key, boundArgs, args, bindFrom, tag, converter,
		tagCtx = this;

	if (tagCtx.tagName) {
		tag = tagCtx;
		tagCtx = (tag.tagCtxs || [tagCtx])[tagElse||0];
		if (!tagCtx) {
			return;
		}
	} else {
		tag = tagCtx.tag;
	}

	bindFrom = tag.bindFrom;
	args = tagCtx.args;

	if ((converter = tag.convert) && typeof converter === STRING) {
		converter = converter === "true"
			? undefined
			: (tagCtx.view.getRsc("converters", converter) || error("Unknown converter: '" + converter + "'"));
	}

	if (converter && !bound) { // If there is a converter, use a copy of the tagCtx.args array for rendering, and replace the args[0] in
		args = args.slice(); // the copied array with the converted value. But we do not modify the value of tag.tagCtx.args[0] (the original args array)
	}
	if (bindFrom) { // Get the values of the boundArgs
		boundArgs = [];
		l = bindFrom.length;
		while (l--) {
			key = bindFrom[l];
			boundArgs.unshift(argOrProp(tagCtx, key));
		}
		if (bound) {
			args = boundArgs; // Call to bndArgs() - returns the boundArgs
		}
	}
	if (converter) {
		converter = converter.apply(tag, boundArgs || args);
		if (converter === undefined) {
			return args; // Returning undefined from a converter is equivalent to not having a converter.
		}
		bindFrom = bindFrom || [0];
		l = bindFrom.length;
		if (!$isArray(converter) || (converter.arg0 !== false && (l === 1 || converter.length !== l || converter.arg0))) {
			converter = [converter]; // Returning converter as first arg, even if converter value is an array
			bindFrom = [0];
			l = 1;
		}
		if (bound) {        // Call to bndArgs() - so apply converter to all boundArgs
			args = converter; // The array of values returned from the converter
		} else {            // Call to cvtArgs()
			while (l--) {
				key = bindFrom[l];
				if (+key === key) {
					args[key] = converter[l];
				}
			}
		}
	}
	return args;
}

function argOrProp(context, key) {
	context = context[+key === key ? "args" : "props"];
	return context && context[key];
}

function convertBoundArgs(tagElse) { // tag.bndArgs()
	return this.cvtArgs(tagElse, 1);
}

//=============
// views.tag
//=============

/* view.getRsc() */
function getResource(resourceType, itemName) {
	var res, store,
		view = this;
	if (typeof itemName === STRING) {
		while ((res === undefined) && view) {
			store = view.tmpl && view.tmpl[resourceType];
			res = store && store[itemName];
			view = view.parent;
		}
		return res || $views[resourceType][itemName];
	}
}

function renderTag(tagName, parentView, tmpl, tagCtxs, isUpdate, onError) {
	function bindToOrBindFrom(type) {
		var bindArray = tag[type];

		if (bindArray !== undefined) {
			bindArray = $isArray(bindArray) ? bindArray : [bindArray];
			m = bindArray.length;
			while (m--) {
				key = bindArray[m];
				if (!isNaN(parseInt(key))) {
					bindArray[m] = parseInt(key); // Convert "0" to 0, etc.
				}
			}
		}

		return bindArray || [0];
	}

	parentView = parentView || topView;
	var tag, tagDef, template, tags, attr, parentTag, l, m, n, itemRet, tagCtx, tagCtxCtx, ctxPrm, bindTo, bindFrom, initVal,
		content, callInit, mapDef, thisMap, args, bdArgs, props, tagDataMap, contentCtx, key, bindFromLength, bindToLength, linkedElement, defaultCtx,
		i = 0,
		ret = "",
		linkCtx = parentView._lc || false, // For data-link="{myTag...}"... See onDataLinkedTagChange
		ctx = parentView.ctx,
		parentTmpl = tmpl || parentView.tmpl,
		// If tagCtxs is an integer, then it is the key for the compiled function to return the boundTag tagCtxs
		boundTag = typeof tagCtxs === "number" && parentView.tmpl.bnds[tagCtxs-1];

	if (tagName._is === "tag") {
		tag = tagName;
		tagName = tag.tagName;
		tagCtxs = tag.tagCtxs;
		template = tag.template;
	} else {
		tagDef = parentView.getRsc("tags", tagName) || error("Unknown tag: {{" + tagName + "}} ");
		template = tagDef.template;
	}
	if (onError === undefined && boundTag && (boundTag._lr = (tagDef.lateRender && boundTag._lr!== false || boundTag._lr))) {
		onError = ""; // If lateRender, set temporary onError, to skip initial rendering (and render just "")
	}
	if (onError !== undefined) {
		ret += onError;
		tagCtxs = onError = [{props: {}, args: [], params: {props:{}}}];
	} else if (boundTag) {
		tagCtxs = boundTag(parentView.data, parentView, $sub);
	}

	l = tagCtxs.length;
	for (; i < l; i++) {
		tagCtx = tagCtxs[i];
		content = tagCtx.tmpl;
		if (!linkCtx || !linkCtx.tag || i && !linkCtx.tag.inline || tag._er || content && +content===content) {
			// Initialize tagCtx
			// For block tags, tagCtx.tmpl is an integer > 0
			if (content && parentTmpl.tmpls) {
				tagCtx.tmpl = tagCtx.content = parentTmpl.tmpls[content - 1]; // Set the tmpl property to the content of the block tag
			}
			tagCtx.index = i;
			tagCtx.ctxPrm = contextParameter;
			tagCtx.render = renderContent;
			tagCtx.cvtArgs = convertArgs;
			tagCtx.bndArgs = convertBoundArgs;
			tagCtx.view = parentView;
			tagCtx.ctx = extendCtx(extendCtx(tagCtx.ctx, tagDef && tagDef.ctx), ctx); // Clone and extend parentView.ctx
		}
		if (tmpl = tagCtx.props.tmpl) {
			// If the tmpl property is overridden, set the value (when initializing, or, in case of binding: ^tmpl=..., when updating)
			tagCtx.tmpl = parentView._getTmpl(tmpl);
			tagCtx.content = tagCtx.content || tagCtx.tmpl;
		}

		if (!tag) {
			// This will only be hit for initial tagCtx (not for {{else}}) - if the tag instance does not exist yet
			// If the tag has not already been instantiated, we will create a new instance.
			// ~tag will access the tag, even within the rendering of the template content of this tag.
			// From child/descendant tags, can access using ~tag.parent, or ~parentTags.tagName
			tag = new tagDef._ctr();
			callInit = !!tag.init;

			tag.parent = parentTag = ctx && ctx.tag;
			tag.tagCtxs = tagCtxs;

			if (linkCtx) {
				tag.inline = false;
				linkCtx.tag = tag;
			}
			tag.linkCtx = linkCtx;
			if (tag._.bnd = boundTag || linkCtx.fn) {
				// Bound if {^{tag...}} or data-link="{tag...}"
				tag._.ths = tagCtx.params.props["this"]; // Tag has a this=expr binding, to get javascript reference to tag instance
				tag._.lt = tagCtxs.lt; // If a late path @some.path has not returned @some object, mark tag as late
				tag._.arrVws = {};
			} else if (tag.dataBoundOnly) {
				error(tagName + " must be data-bound:\n{^{" + tagName + "}}");
			}
			//TODO better perf for childTags() - keep child tag.tags array, (and remove child, when disposed)
			// tag.tags = [];
		} else if (linkCtx && linkCtx.fn._lr) {
			callInit = !!tag.init;
		}
		tagDataMap = tag.dataMap;

		tagCtx.tag = tag;
		if (tagDataMap && tagCtxs) {
			tagCtx.map = tagCtxs[i].map; // Copy over the compiled map instance from the previous tagCtxs to the refreshed ones
		}
		if (!tag.flow) {
			tagCtxCtx = tagCtx.ctx = tagCtx.ctx || {};

			// tags hash: tag.ctx.tags, merged with parentView.ctx.tags,
			tags = tag.parents = tagCtxCtx.parentTags = ctx && extendCtx(tagCtxCtx.parentTags, ctx.parentTags) || {};
			if (parentTag) {
				tags[parentTag.tagName] = parentTag;
				//TODO better perf for childTags: parentTag.tags.push(tag);
			}
			tags[tag.tagName] = tagCtxCtx.tag = tag;
			tagCtxCtx.tagCtx = tagCtx;
		}
	}
	if (!(tag._er = onError)) {
		tagHandlersFromProps(tag, tagCtxs[0]);
		tag.rendering = {rndr: tag.rendering}; // Provide object for state during render calls to tag and elses. (Used by {{if}} and {{for}}...)
		for (i = 0; i < l; i++) { // Iterate tagCtx for each {{else}} block
			tagCtx = tag.tagCtx = tagCtxs[i];
			props = tagCtx.props;
			tag.ctx = tagCtx.ctx;

			if (!i) {
				if (callInit) {
					tag.init(tagCtx, linkCtx, tag.ctx);
					callInit = undefined;
				}
				if (!tagCtx.args.length && tagCtx.argDefault !== false && tag.argDefault !== false) {
					tagCtx.args = args = [tagCtx.view.data]; // Missing first arg defaults to the current data context
					tagCtx.params.args = ["#data"];
				}

				bindTo = bindToOrBindFrom("bindTo");

				if (tag.bindTo !== undefined) {
					tag.bindTo = bindTo;
				}

				if (tag.bindFrom !== undefined) {
					tag.bindFrom = bindToOrBindFrom("bindFrom");
				} else if (tag.bindTo) {
					tag.bindFrom = tag.bindTo = bindTo;
				}
				bindFrom = tag.bindFrom || bindTo;

				bindToLength = bindTo.length;
				bindFromLength = bindFrom.length;

				if (tag._.bnd && (linkedElement = tag.linkedElement)) {
					tag.linkedElement = linkedElement = $isArray(linkedElement) ? linkedElement: [linkedElement];

					if (bindToLength !== linkedElement.length) {
						error("linkedElement not same length as bindTo");
					}
				}
				if (linkedElement = tag.linkedCtxParam) {
					tag.linkedCtxParam = linkedElement = $isArray(linkedElement) ? linkedElement: [linkedElement];

					if (bindFromLength !== linkedElement.length) {
						error("linkedCtxParam not same length as bindFrom/bindTo");
					}
				}

				if (bindFrom) {
					tag._.fromIndex = {}; // Hash of bindFrom index which has same path value as bindTo index. fromIndex = tag._.fromIndex[toIndex]
					tag._.toIndex = {}; // Hash of bindFrom index which has same path value as bindTo index. fromIndex = tag._.fromIndex[toIndex]
					n = bindFromLength;
					while (n--) {
						key = bindFrom[n];
						m = bindToLength;
						while (m--) {
							if (key === bindTo[m]) {
								tag._.fromIndex[m] = n;
								tag._.toIndex[n] = m;
							}
						}
					}
				}

				if (linkCtx) {
					// Set attr on linkCtx to ensure outputting to the correct target attribute.
					// Setting either linkCtx.attr or this.attr in the init() allows per-instance choice of target attrib.
					linkCtx.attr = tag.attr = linkCtx.attr || tag.attr || linkCtx._dfAt;
				}
				attr = tag.attr;
				tag._.noVws = attr && attr !== HTML;
			}
			args = tag.cvtArgs(i);
			if (tag.linkedCtxParam) {
				bdArgs = tag.cvtArgs(i, 1);
				m = bindFromLength;
				defaultCtx = tag.constructor.prototype.ctx;
				while (m--) {
					if (ctxPrm = tag.linkedCtxParam[m]) {
						key = bindFrom[m];
						initVal = bdArgs[m];
						// Create tag contextual parameter
						tagCtx.ctx[ctxPrm] = $sub._cp(
							defaultCtx && initVal === undefined ? defaultCtx[ctxPrm]: initVal,
							initVal !== undefined && argOrProp(tagCtx.params, key),
							tagCtx.view,
							tag._.bnd && {tag: tag, cvt: tag.convert, ind: m, tagElse: i}
						);
					}
				}
			}
			if ((mapDef = props.dataMap || tagDataMap) && (args.length || props.dataMap)) {
				thisMap = tagCtx.map;
				if (!thisMap || thisMap.src !== args[0] || isUpdate) {
					if (thisMap && thisMap.src) {
						thisMap.unmap(); // only called if observable map - not when only used in JsRender, e.g. by {{props}}
					}
					mapDef.map(args[0], tagCtx, thisMap, !tag._.bnd);
					thisMap = tagCtx.map;
				}
				args = [thisMap.tgt];
			}

			itemRet = undefined;
			if (tag.render) {
				itemRet = tag.render.apply(tag, args);
				if (parentView.linked && itemRet && !rWrappedInViewMarker.test(itemRet)) {
					// When a tag renders content from the render method, with data linking then we need to wrap with view markers, if absent,
					// to provide a contentView for the tag, which will correctly dispose bindings if deleted. The 'tmpl' for this view will
					// be a dumbed-down template which will always return the itemRet string (no matter what the data is). The itemRet string
					// is not compiled as template markup, so can include "{{" or "}}" without triggering syntax errors
					tmpl = { // 'Dumbed-down' template which always renders 'static' itemRet string
						links: []
					};
					tmpl.render = tmpl.fn = function() {
						return itemRet;
					};
					itemRet = renderWithViews(tmpl, parentView.data, undefined, true, parentView, undefined, undefined, tag);
				}
			}
			if (!args.length) {
				args = [parentView]; // no arguments - (e.g. {{else}}) get data context from view.
			}
			if (itemRet === undefined) {
				contentCtx = args[0]; // Default data context for wrapped block content is the first argument
				if (tag.contentCtx) { // Set tag.contentCtx to true, to inherit parent context, or to a function to provide alternate context.
					contentCtx = tag.contentCtx === true ? parentView : tag.contentCtx(contentCtx);
				}
				itemRet = tagCtx.render(contentCtx, true) || (isUpdate ? undefined : "");
			}
			ret = ret
				? ret + (itemRet || "")
				: itemRet !== undefined
					? "" + itemRet
					: undefined; // If no return value from render, and no template/content tagCtx.render(...), return undefined
		}
		tag.rendering = tag.rendering.rndr; // Remove tag.rendering object (if this is outermost render call. (In case of nested calls)
	}
	tag.tagCtx = tagCtxs[0];
	tag.ctx = tag.tagCtx.ctx;

	if (tag._.noVws && tag.inline) {
		// inline tag with attr set to "text" will insert HTML-encoded content - as if it was element-based innerText
		ret = attr === "text"
			? $converters.html(ret)
			: "";
	}
	return boundTag && parentView._.onRender
		// Call onRender (used by JsViews if present, to add binding annotations around rendered content)
		? parentView._.onRender(ret, parentView, tag)
		: ret;
}

//=================
// View constructor
//=================

function View(context, type, parentView, data, template, key, onRender, contentTmpl) {
	// Constructor for view object in view hierarchy. (Augmented by JsViews if JsViews is loaded)
	var views, parentView_, tag, self_,
		self = this,
		isArray = type === "array";
		// If the data is an array, this is an 'array view' with a views array for each child 'item view'
		// If the data is not an array, this is an 'item view' with a views 'hash' object for any child nested views

	self.content = contentTmpl;
	self.views = isArray ? [] : {};
	self.data = data;
	self.tmpl = template;
	self_ = self._ = {
		key: 0,
		// ._.useKey is non zero if is not an 'array view' (owning a data array). Use this as next key for adding to child views hash
		useKey: isArray ? 0 : 1,
		id: "" + viewId++,
		onRender: onRender,
		bnds: {}
	};
	self.linked = !!onRender;
	self.type = type || "top";
	if (type) {
		self.cache = {_ct: $subSettings._cchCt}; // Used for caching results of computed properties and helpers (view.getCache)
	}

	if (!parentView || parentView.type === "top") {
		(self.ctx = context || {}).root = self.data;
	}

	if (self.parent = parentView) {
		self.root = parentView.root || self; // view whose parent is top view
		views = parentView.views;
		parentView_ = parentView._;
		self.isTop = parentView_.scp; // Is top content view of a link("#container", ...) call
		self.scope = (!context.tag || context.tag === parentView.ctx.tag) && !self.isTop && parentView.scope || self;
		// Scope for contextParams - closest non flow tag ancestor or root view
		if (parentView_.useKey) {
			// Parent is not an 'array view'. Add this view to its views object
			// self._key = is the key in the parent view hash
			views[self_.key = "_" + parentView_.useKey++] = self;
			self.index = indexStr;
			self.getIndex = getNestedIndex;
		} else if (views.length === (self_.key = self.index = key)) { // Parent is an 'array view'. Add this view to its views array
			views.push(self); // Adding to end of views array. (Using push when possible - better perf than splice)
		} else {
			views.splice(key, 0, self); // Inserting in views array
		}
		// If no context was passed in, use parent context
		// If context was passed in, it should have been merged already with parent context
		self.ctx = context || parentView.ctx;
	} else if (type) {
		self.root = self; // view whose parent is top view
	}
}

View.prototype = {
	get: getView,
	getIndex: getIndex,
	ctxPrm: contextParameter,
	getRsc: getResource,
	_getTmpl: getTemplate,
	_getOb: getPathObject,
	getCache: function(key) { // Get cached value of computed value
		if ($subSettings._cchCt > this.cache._ct) {
			this.cache = {_ct: $subSettings._cchCt};
		}
		return this.cache[key] !== undefined ? this.cache[key] : (this.cache[key] = cpFnStore[key](this.data, this, $sub));
	},
	_is: "view"
};

//====================================================
// Registration
//====================================================

function compileChildResources(parentTmpl) {
	var storeName, storeNames, resources;
	for (storeName in jsvStores) {
		storeNames = storeName + "s";
		if (parentTmpl[storeNames]) {
			resources = parentTmpl[storeNames];        // Resources not yet compiled
			parentTmpl[storeNames] = {};               // Remove uncompiled resources
			$views[storeNames](resources, parentTmpl); // Add back in the compiled resources
		}
	}
}

//===============
// compileTag
//===============

function compileTag(name, tagDef, parentTmpl) {
	var tmpl, baseTag, prop,
		compiledDef = new $sub._tg();

	function Tag() {
		var tag = this;
		tag._ = {
			unlinked: true
		};
		tag.inline = true;
		tag.tagName = name;
	}

	if ($isFunction(tagDef)) {
		// Simple tag declared as function. No presenter instantation.
		tagDef = {
			depends: tagDef.depends,
			render: tagDef
		};
	} else if (typeof tagDef === STRING) {
		tagDef = {template: tagDef};
	}

	if (baseTag = tagDef.baseTag) {
		tagDef.flow = !!tagDef.flow; // Set flow property, so defaults to false even if baseTag has flow=true
		baseTag = typeof baseTag === STRING
			? (parentTmpl && parentTmpl.tags[baseTag] || $tags[baseTag])
			: baseTag;
		if (!baseTag) {
			error('baseTag: "' + tagDef.baseTag + '" not found');
		}
		compiledDef = $extend(compiledDef, baseTag);

		for (prop in tagDef) {
			compiledDef[prop] = getMethod(baseTag[prop], tagDef[prop]);
		}
	} else {
		compiledDef = $extend(compiledDef, tagDef);
	}

	// Tag declared as object, used as the prototype for tag instantiation (control/presenter)
	if ((tmpl = compiledDef.template) !== undefined) {
		compiledDef.template = typeof tmpl === STRING ? ($templates[tmpl] || $templates(tmpl)) : tmpl;
	}
	(Tag.prototype = compiledDef).constructor = compiledDef._ctr = Tag;

	if (parentTmpl) {
		compiledDef._parentTmpl = parentTmpl;
	}
	return compiledDef;
}

function baseApply(args) {
	// In derived method (or handler declared declaratively as in {{:foo onChange=~fooChanged}} can call base method,
	// using this.baseApply(arguments) (Equivalent to this._superApply(arguments) in jQuery UI)
	return this.base.apply(this, args);
}

//===============
// compileTmpl
//===============

function compileTmpl(name, tmpl, parentTmpl, options) {
	// tmpl is either a template object, a selector for a template script block, or the name of a compiled template

	//==== nested functions ====
	function lookupTemplate(value) {
		// If value is of type string - treat as selector, or name of compiled template
		// Return the template object, if already compiled, or the markup string
		var currentName, tmpl;
		if ((typeof value === STRING) || value.nodeType > 0 && (elem = value)) {
			if (!elem) {
				if (/^\.?\/[^\\:*?"<>]*$/.test(value)) {
					// value="./some/file.html" (or "/some/file.html")
					// If the template is not named, use "./some/file.html" as name.
					if (tmpl = $templates[name = name || value]) {
						value = tmpl;
					} else {
						// BROWSER-SPECIFIC CODE (not on Node.js):
						// Look for server-generated script block with id "./some/file.html"
						elem = document.getElementById(value);
					}
				} else if (value.charAt(0) === "#") {
					elem = document.getElementById(value.slice(1));
				} if (!elem && $.fn && !$sub.rTmpl.test(value)) {
					try {
						elem = $(value, document)[0]; // if jQuery is loaded, test for selector returning elements, and get first element
					} catch (e) {}
				}// END BROWSER-SPECIFIC CODE
			} //BROWSER-SPECIFIC CODE
			if (elem) {
				if (elem.tagName !== "SCRIPT") {
					error(value + ": Use script block, not " + elem.tagName);
				}
				if (options) {
					// We will compile a new template using the markup in the script element
					value = elem.innerHTML;
				} else {
					// We will cache a single copy of the compiled template, and associate it with the name
					// (renaming from a previous name if there was one).
					currentName = elem.getAttribute(tmplAttr);
					if (currentName) {
						if (currentName !== jsvTmpl) {
							value = $templates[currentName];
							delete $templates[currentName];
						} else if ($.fn) {
							value = $.data(elem)[jsvTmpl]; // Get cached compiled template
						}
					}
					if (!currentName || !value) { // Not yet compiled, or cached version lost
						name = name || ($.fn ? jsvTmpl : value);
						value = compileTmpl(name, elem.innerHTML, parentTmpl, options);
					}
					value.tmplName = name = name || currentName;
					if (name !== jsvTmpl) {
						$templates[name] = value;
					}
					elem.setAttribute(tmplAttr, name);
					if ($.fn) {
						$.data(elem, jsvTmpl, value);
					}
				}
			} // END BROWSER-SPECIFIC CODE
			elem = undefined;
		} else if (!value.fn) {
			value = undefined;
			// If value is not a string. HTML element, or compiled template, return undefined
		}
		return value;
	}

	var elem, compiledTmpl,
		tmplOrMarkup = tmpl = tmpl || "";
	$sub._html = $converters.html;

	//==== Compile the template ====
	if (options === 0) {
		options = undefined;
		tmplOrMarkup = lookupTemplate(tmplOrMarkup); // Top-level compile so do a template lookup
	}

	// If options, then this was already compiled from a (script) element template declaration.
	// If not, then if tmpl is a template object, use it for options
	options = options || (tmpl.markup
		? tmpl.bnds
			? $extend({}, tmpl)
			: tmpl
		: {}
	);

	options.tmplName = options.tmplName || name || "unnamed";
	if (parentTmpl) {
		options._parentTmpl = parentTmpl;
	}
	// If tmpl is not a markup string or a selector string, then it must be a template object
	// In that case, get it from the markup property of the object
	if (!tmplOrMarkup && tmpl.markup && (tmplOrMarkup = lookupTemplate(tmpl.markup)) && tmplOrMarkup.fn) {
		// If the string references a compiled template object, need to recompile to merge any modified options
		tmplOrMarkup = tmplOrMarkup.markup;
	}
	if (tmplOrMarkup !== undefined) {
		if (tmplOrMarkup.render || tmpl.render) {
			// tmpl is already compiled, so use it
			if (tmplOrMarkup.tmpls) {
				compiledTmpl = tmplOrMarkup;
			}
		} else {
			// tmplOrMarkup is a markup string, not a compiled template
			// Create template object
			tmpl = tmplObject(tmplOrMarkup, options);
			// Compile to AST and then to compiled function
			tmplFn(tmplOrMarkup.replace(rEscapeQuotes, "\\$&"), tmpl);
		}
		if (!compiledTmpl) {
			compiledTmpl = $extend(function() {
				return compiledTmpl.render.apply(compiledTmpl, arguments);
			}, tmpl);

			compileChildResources(compiledTmpl);
		}
		return compiledTmpl;
	}
}

//==== /end of function compileTmpl ====

//=================
// compileViewModel
//=================

function getDefaultVal(defaultVal, data) {
	return $isFunction(defaultVal)
		? defaultVal.call(data)
		: defaultVal;
}

function addParentRef(ob, ref, parent) {
	Object.defineProperty(ob, ref, {
		value: parent,
		configurable: true
	});
}

function compileViewModel(name, type) {
	var i, constructor, parent,
		viewModels = this,
		getters = type.getters,
		extend = type.extend,
		id = type.id,
		proto = $.extend({
			_is: name || "unnamed",
			unmap: unmap,
			merge: merge
		}, extend),
		args = "",
		cnstr = "",
		getterCount = getters ? getters.length : 0,
		$observable = $.observable,
		getterNames = {};

	function JsvVm(args) {
		constructor.apply(this, args);
	}

	function vm() {
		return new JsvVm(arguments);
	}

	function iterate(data, action) {
		var getterType, defaultVal, prop, ob, parentRef,
			j = 0;
		for (; j < getterCount; j++) {
			prop = getters[j];
			getterType = undefined;
			if (typeof prop !== STRING) {
				getterType = prop;
				prop = getterType.getter;
				parentRef = getterType.parentRef;
			}
			if ((ob = data[prop]) === undefined && getterType && (defaultVal = getterType.defaultVal) !== undefined) {
				ob = getDefaultVal(defaultVal, data);
			}
			action(ob, getterType && viewModels[getterType.type], prop, parentRef);
		}
	}

	function map(data) {
		data = typeof data === STRING
			? JSON.parse(data) // Accept JSON string
			: data;            // or object/array
		var l, prop, childOb, parentRef,
			j = 0,
			ob = data,
			arr = [];

		if ($isArray(data)) {
			data = data || [];
			l = data.length;
			for (; j<l; j++) {
				arr.push(this.map(data[j]));
			}
			arr._is = name;
			arr.unmap = unmap;
			arr.merge = merge;
			return arr;
		}

		if (data) {
			iterate(data, function(ob, viewModel) {
				if (viewModel) { // Iterate to build getters arg array (value, or mapped value)
					ob = viewModel.map(ob);
				}
				arr.push(ob);
			});
			ob = this.apply(this, arr); // Instantiate this View Model, passing getters args array to constructor
			j = getterCount;
			while (j--) {
				childOb = arr[j];
				parentRef = getters[j].parentRef;
				if (parentRef && childOb && childOb.unmap) {
					if ($isArray(childOb)) {
						l = childOb.length;
						while (l--) {
							addParentRef(childOb[l], parentRef, ob);
						}
					} else {
						addParentRef(childOb, parentRef, ob);
					}
				}
			}
			for (prop in data) { // Copy over any other properties. that are not get/set properties
				if (prop !== $expando && !getterNames[prop]) {
					ob[prop] = data[prop];
				}
			}
		}
		return ob;
	}

	function merge(data, parent, parentRef) {
		data = typeof data === STRING
			? JSON.parse(data) // Accept JSON string
			: data;            // or object/array

		var j, l, m, prop, mod, found, assigned, ob, newModArr, childOb,
			k = 0,
			model = this;

		if ($isArray(model)) {
			assigned = {};
			newModArr = [];
			l = data.length;
			m = model.length;
			for (; k<l; k++) {
				ob = data[k];
				found = false;
				for (j=0; j<m && !found; j++) {
					if (assigned[j]) {
						continue;
					}
					mod = model[j];

					if (id) {
						assigned[j] = found = typeof id === STRING
						? (ob[id] && (getterNames[id] ? mod[id]() : mod[id]) === ob[id])
						: id(mod, ob);
					}
				}
				if (found) {
					mod.merge(ob);
					newModArr.push(mod);
				} else {
					newModArr.push(childOb = vm.map(ob));
					if (parentRef) {
						addParentRef(childOb, parentRef, parent);
					}
				}
			}
			if ($observable) {
				$observable(model).refresh(newModArr, true);
			} else {
				model.splice.apply(model, [0, model.length].concat(newModArr));
			}
			return;
		}
		iterate(data, function(ob, viewModel, getter, parentRef) {
			if (viewModel) {
				model[getter]().merge(ob, model, parentRef); // Update typed property
			} else if (model[getter]() !== ob) {
				model[getter](ob); // Update non-typed property
			}
		});
		for (prop in data) {
			if (prop !== $expando && !getterNames[prop]) {
				model[prop] = data[prop];
			}
		}
	}

	function unmap() {
		var ob, prop, getterType, arr, value,
			k = 0,
			model = this;

		function unmapArray(modelArr) {
			var arr = [],
				i = 0,
				l = modelArr.length;
			for (; i<l; i++) {
				arr.push(modelArr[i].unmap());
			}
			return arr;
		}

		if ($isArray(model)) {
			return unmapArray(model);
		}
		ob = {};
		for (; k < getterCount; k++) {
			prop = getters[k];
			getterType = undefined;
			if (typeof prop !== STRING) {
				getterType = prop;
				prop = getterType.getter;
			}
			value = model[prop]();
			ob[prop] = getterType && value && viewModels[getterType.type]
				? $isArray(value)
					? unmapArray(value)
					: value.unmap()
				: value;
		}
		for (prop in model) {
			if (model.hasOwnProperty(prop) && (prop.charAt(0) !== "_" || !getterNames[prop.slice(1)]) && prop !== $expando && !$isFunction(model[prop])) {
				ob[prop] = model[prop];
			}
		}
		return ob;
	}

	JsvVm.prototype = proto;

	for (i=0; i < getterCount; i++) {
		(function(getter) {
			getter = getter.getter || getter;
			getterNames[getter] = i+1;
			var privField = "_" + getter;

			args += (args ? "," : "") + getter;
			cnstr += "this." + privField + " = " + getter + ";\n";
			proto[getter] = proto[getter] || function(val) {
				if (!arguments.length) {
					return this[privField]; // If there is no argument, use as a getter
				}
				if ($observable) {
					$observable(this).setProperty(getter, val);
				} else {
					this[privField] = val;
				}
			};

			if ($observable) {
				proto[getter].set = proto[getter].set || function(val) {
					this[privField] = val; // Setter called by observable property change
				};
			}
		})(getters[i]);
	}

	// Constructor for new viewModel instance.
	cnstr = new Function(args, cnstr);

	constructor = function() {
		cnstr.apply(this, arguments);
		// Pass additional parentRef str and parent obj to have a parentRef pointer on instance
		if (parent = arguments[getterCount + 1]) {
			addParentRef(this, arguments[getterCount], parent);
		}
	};

	constructor.prototype = proto;
	proto.constructor = constructor;

	vm.map = map;
	vm.getters = getters;
	vm.extend = extend;
	vm.id = id;
	return vm;
}

function tmplObject(markup, options) {
	// Template object constructor
	var htmlTag,
		wrapMap = $subSettingsAdvanced._wm || {}, // Only used in JsViews. Otherwise empty: {}
		tmpl = {
			tmpls: [],
			links: {}, // Compiled functions for link expressions
			bnds: [],
			_is: "template",
			render: renderContent
		};

	if (options) {
		tmpl = $extend(tmpl, options);
	}

	tmpl.markup = markup;
	if (!tmpl.htmlTag) {
		// Set tmpl.tag to the top-level HTML tag used in the template, if any...
		htmlTag = rFirstElem.exec(markup);
		tmpl.htmlTag = htmlTag ? htmlTag[1].toLowerCase() : "";
	}
	htmlTag = wrapMap[tmpl.htmlTag];
	if (htmlTag && htmlTag !== wrapMap.div) {
		// When using JsViews, we trim templates which are inserted into HTML contexts where text nodes are not rendered (i.e. not 'Phrasing Content').
		// Currently not trimmed for <li> tag. (Not worth adding perf cost)
		tmpl.markup = $.trim(tmpl.markup);
	}

	return tmpl;
}

//==============
// registerStore
//==============

/**
* Internal. Register a store type (used for template, tags, helpers, converters)
*/
function registerStore(storeName, storeSettings) {

/**
* Generic store() function to register item, named item, or hash of items
* Also used as hash to store the registered items
* Used as implementation of $.templates(), $.views.templates(), $.views.tags(), $.views.helpers() and $.views.converters()
*
* @param {string|hash} name         name - or selector, in case of $.templates(). Or hash of items
* @param {any}         [item]       (e.g. markup for named template)
* @param {template}    [parentTmpl] For item being registered as private resource of template
* @returns {any|$.views} item, e.g. compiled template - or $.views in case of registering hash of items
*/
	function theStore(name, item, parentTmpl) {
		// The store is also the function used to add items to the store. e.g. $.templates, or $.views.tags

		// For store of name 'thing', Call as:
		//    $.views.things(items[, parentTmpl]),
		// or $.views.things(name[, item, parentTmpl])

		var compile, itemName, thisStore, cnt,
			onStore = $sub.onStore[storeName];

		if (name && typeof name === OBJECT && !name.nodeType && !name.markup && !name.getTgt && !(storeName === "viewModel" && name.getters || name.extend)) {
			// Call to $.views.things(items[, parentTmpl]),

			// Adding items to the store
			// If name is a hash, then item is parentTmpl. Iterate over hash and call store for key.
			for (itemName in name) {
				theStore(itemName, name[itemName], item);
			}
			return item || $views;
		}
		// Adding a single unnamed item to the store
		if (name &&  typeof name !== STRING) { // name must be a string
			parentTmpl = item;
			item = name;
			name = undefined;
		}
		thisStore = parentTmpl
			? storeName === "viewModel"
				? parentTmpl
				: (parentTmpl[storeNames] = parentTmpl[storeNames] || {})
			: theStore;
		compile = storeSettings.compile;

		if (item === undefined) {
			item = compile ? name : thisStore[name];
			name = undefined;
		}
		if (item === null) {
			// If item is null, delete this entry
			if (name) {
				delete thisStore[name];
			}
		} else {
			if (compile) {
				item = compile.call(thisStore, name, item, parentTmpl, 0) || {};
				item._is = storeName; // Only do this for compiled objects (tags, templates...)
			}
			if (name) {
				thisStore[name] = item;
			}
		}
		if (onStore) {
			// e.g. JsViews integration
			onStore(name, item, parentTmpl, compile);
		}
		return item;
	}

	var storeNames = storeName + "s";
	$views[storeNames] = theStore;
}

/**
* Add settings such as:
* $.views.settings.allowCode(true)
* @param {boolean} value
* @returns {Settings}
*
* allowCode = $.views.settings.allowCode()
* @returns {boolean}
*/
function addSetting(st) {
	$viewsSettings[st] = $viewsSettings[st] || function(value) {
		return arguments.length
			? ($subSettings[st] = value, $viewsSettings)
			: $subSettings[st];
	};
}

//========================
// dataMap for render only
//========================

function dataMap(mapDef) {
	function Map(source, options) {
		this.tgt = mapDef.getTgt(source, options);
		options.map = this;
	}

	if ($isFunction(mapDef)) {
		// Simple map declared as function
		mapDef = {
			getTgt: mapDef
		};
	}

	if (mapDef.baseMap) {
		mapDef = $extend($extend({}, mapDef.baseMap), mapDef);
	}

	mapDef.map = function(source, options) {
		return new Map(source, options);
	};
	return mapDef;
}

//==============
// renderContent
//==============

/** Render the template as a string, using the specified data and helpers/context
* $("#tmpl").render(), tmpl.render(), tagCtx.render(), $.render.namedTmpl()
*
* @param {any}        data
* @param {hash}       [context]           helpers or context
* @param {boolean}    [noIteration]
* @param {View}       [parentView]        internal
* @param {string}     [key]               internal
* @param {function}   [onRender]          internal
* @returns {string}   rendered template   internal
*/
function renderContent(data, context, noIteration, parentView, key, onRender) {
	var i, l, tag, tmpl, tagCtx, isTopRenderCall, prevData, prevIndex,
		view = parentView,
		result = "";

	if (context === true) {
		noIteration = context; // passing boolean as second param - noIteration
		context = undefined;
	} else if (typeof context !== OBJECT) {
		context = undefined; // context must be a boolean (noIteration) or a plain object
	}

	if (tag = this.tag) {
		// This is a call from renderTag or tagCtx.render(...)
		tagCtx = this;
		view = view || tagCtx.view;
		tmpl = view._getTmpl(tag.template || tagCtx.tmpl);
		if (!arguments.length) {
			data = tag.contentCtx && $isFunction(tag.contentCtx)
				? data = tag.contentCtx(data)
				: view; // Default data context for wrapped block content is the first argument
		}
	} else {
		// This is a template.render(...) call
		tmpl = this;
	}

	if (tmpl) {
		if (!parentView && data && data._is === "view") {
			view = data; // When passing in a view to render or link (and not passing in a parent view) use the passed-in view as parentView
		}

		if (view && data === view) {
			// Inherit the data from the parent view.
			data = view.data;
		}

		isTopRenderCall = !view;
		isRenderCall = isRenderCall || isTopRenderCall;
		if (isTopRenderCall) {
			(context = context || {}).root = data; // Provide ~root as shortcut to top-level data.
		}
		if (!isRenderCall || $subSettingsAdvanced.useViews || tmpl.useViews || view && view !== topView) {
			result = renderWithViews(tmpl, data, context, noIteration, view, key, onRender, tag);
		} else {
			if (view) { // In a block
				prevData = view.data;
				prevIndex = view.index;
				view.index = indexStr;
			} else {
				view = topView;
				prevData = view.data;
				view.data = data;
				view.ctx = context;
			}
			if ($isArray(data) && !noIteration) {
				// Create a view for the array, whose child views correspond to each data item. (Note: if key and parentView are passed in
				// along with parent view, treat as insert -e.g. from view.addViews - so parentView is already the view item for array)
				for (i = 0, l = data.length; i < l; i++) {
					view.index = i;
					view.data = data[i];
					result += tmpl.fn(data[i], view, $sub);
				}
			} else {
				view.data = data;
				result += tmpl.fn(data, view, $sub);
			}
			view.data = prevData;
			view.index = prevIndex;
		}
		if (isTopRenderCall) {
			isRenderCall = undefined;
		}
	}
	return result;
}

function renderWithViews(tmpl, data, context, noIteration, view, key, onRender, tag) {
	// Render template against data as a tree of subviews (nested rendered template instances), or as a string (top-level template).
	// If the data is the parent view, treat as noIteration, re-render with the same data context.
	// tmpl can be a string (e.g. rendered by a tag.render() method), or a compiled template.
	var i, l, newView, childView, itemResult, swapContent, contentTmpl, outerOnRender, tmplName, itemVar, newCtx, tagCtx, noLinking,
		result = "";

	if (tag) {
		// This is a call from renderTag or tagCtx.render(...)
		tmplName = tag.tagName;
		tagCtx = tag.tagCtx;
		context = context ? extendCtx(context, tag.ctx) : tag.ctx;

		if (tmpl === view.content) { // {{xxx tmpl=#content}}
			contentTmpl = tmpl !== view.ctx._wrp // We are rendering the #content
				? view.ctx._wrp // #content was the tagCtx.props.tmpl wrapper of the block content - so within this view, #content will now be the view.ctx._wrp block content
				: undefined; // #content was the view.ctx._wrp block content - so within this view, there is no longer any #content to wrap.
		} else if (tmpl !== tagCtx.content) {
			if (tmpl === tag.template) { // Rendering {{tag}} tag.template, replacing block content.
				contentTmpl = tagCtx.tmpl; // Set #content to block content (or wrapped block content if tagCtx.props.tmpl is set)
				context._wrp = tagCtx.content; // Pass wrapped block content to nested views
			} else { // Rendering tagCtx.props.tmpl wrapper
				contentTmpl = tagCtx.content || view.content; // Set #content to wrapped block content
			}
		} else {
			contentTmpl = view.content; // Nested views inherit same wrapped #content property
		}

		if (tagCtx.props.link === false) {
			// link=false setting on block tag
			// We will override inherited value of link by the explicit setting link=false taken from props
			// The child views of an unlinked view are also unlinked. So setting child back to true will not have any effect.
			context = context || {};
			context.link = false;
		}
	}

	if (view) {
		onRender = onRender || view._.onRender;
		noLinking = context && context.link === false;

		if (noLinking && view._.nl) {
			onRender = undefined;
		}

		context = extendCtx(context, view.ctx);
		tagCtx = !tag && view.tag
			? view.tag.tagCtxs[view.tagElse]
			: tagCtx;
	}

	if (itemVar = tagCtx && tagCtx.props.itemVar) {
		if (itemVar[0] !== "~") {
			syntaxError("Use itemVar='~myItem'");
		}
		itemVar = itemVar.slice(1);
	}

	if (key === true) {
		swapContent = true;
		key = 0;
	}

	// If link===false, do not call onRender, so no data-linking marker nodes
	if (onRender && tag && tag._.noVws) {
		onRender = undefined;
	}
	outerOnRender = onRender;
	if (onRender === true) {
		// Used by view.refresh(). Don't create a new wrapper view.
		outerOnRender = undefined;
		onRender = view._.onRender;
	}
	// Set additional context on views created here, (as modified context inherited from the parent, and to be inherited by child views)
	context = tmpl.helpers
		? extendCtx(tmpl.helpers, context)
		: context;

	newCtx = context;
	if ($isArray(data) && !noIteration) {
		// Create a view for the array, whose child views correspond to each data item. (Note: if key and view are passed in
		// along with parent view, treat as insert -e.g. from view.addViews - so view is already the view item for array)
		newView = swapContent
			? view
			: (key !== undefined && view)
				|| new View(context, "array", view, data, tmpl, key, onRender, contentTmpl);
		newView._.nl= noLinking;
		if (view && view._.useKey) {
			// Parent is not an 'array view'
			newView._.bnd = !tag || tag._.bnd && tag; // For array views that are data bound for collection change events, set the
			// view._.bnd property to true for top-level link() or data-link="{for}", or to the tag instance for a data-bound tag, e.g. {^{for ...}}
			newView.tag = tag;
		}
		for (i = 0, l = data.length; i < l; i++) {
			// Create a view for each data item.
			childView = new View(newCtx, "item", newView, data[i], tmpl, (key || 0) + i, onRender, newView.content);
			if (itemVar) {
				(childView.ctx = $extend({}, newCtx))[itemVar] = $sub._cp(data[i], "#data", childView);
			}
			itemResult = tmpl.fn(data[i], childView, $sub);
			result += newView._.onRender ? newView._.onRender(itemResult, childView) : itemResult;
		}
	} else {
		// Create a view for singleton data object. The type of the view will be the tag name, e.g. "if" or "mytag" except for
		// "item", "array" and "data" views. A "data" view is from programmatic render(object) against a 'singleton'.
		newView = swapContent ? view : new View(newCtx, tmplName || "data", view, data, tmpl, key, onRender, contentTmpl);

		if (itemVar) {
			(newView.ctx = $extend({}, newCtx))[itemVar] = $sub._cp(data, "#data", newView);
		}

		newView.tag = tag;
		newView._.nl = noLinking;
		result += tmpl.fn(data, newView, $sub);
	}
	if (tag) {
		newView.tagElse = tagCtx.index;
		tagCtx.contentView = newView;
	}
	return outerOnRender ? outerOnRender(result, newView) : result;
}

//===========================
// Build and compile template
//===========================

// Generate a reusable function that will serve to render a template against data
// (Compile AST then build template function)

function onRenderError(e, view, fallback) {
	var message = fallback !== undefined
		? $isFunction(fallback)
			? fallback.call(view.data, e, view)
			: fallback || ""
		: "{Error: " + (e.message||e) + "}";

	if ($subSettings.onError && (fallback = $subSettings.onError.call(view.data, e, fallback && message, view)) !== undefined) {
		message = fallback; // There is a settings.debugMode(handler) onError override. Call it, and use return value (if any) to replace message
	}
	return view && !view._lc ? $converters.html(message) : message; // For data-link=\"{... onError=...}"... See onDataLinkedTagChange
}

function error(message) {
	throw new $sub.Err(message);
}

function syntaxError(message) {
	error("Syntax error\n" + message);
}

function tmplFn(markup, tmpl, isLinkExpr, convertBack, hasElse) {
	// Compile markup to AST (abtract syntax tree) then build the template function code from the AST nodes
	// Used for compiling templates, and also by JsViews to build functions for data link expressions

	//==== nested functions ====
	function pushprecedingContent(shift) {
		shift -= loc;
		if (shift) {
			content.push(markup.substr(loc, shift).replace(rNewLine, "\\n"));
		}
	}

	function blockTagCheck(tagName, block) {
		if (tagName) {
			tagName += '}}';
			//			'{{include}} block has {{/for}} with no open {{for}}'
			syntaxError((
				block
					? '{{' + block + '}} block has {{/' + tagName + ' without {{' + tagName
					: 'Unmatched or missing {{/' + tagName) + ', in template:\n' + markup);
		}
	}

	function parseTag(all, bind, tagName, converter, colon, html, codeTag, params, slash, bind2, closeBlock, index) {
/*

     bind     tagName         cvt   cln html code    params            slash   bind2         closeBlk  comment
/(?:{(\^)?{(?:(\w+(?=[\/\s}]))|(\w+)?(:)|(>)|(\*))\s*((?:[^}]|}(?!}))*?)(\/)?|{(\^)?{(?:(?:\/(\w+))\s*|!--[\s\S]*?--))}}/g

(?:
  {(\^)?{            bind
  (?:
    (\w+             tagName
      (?=[\/\s}])
    )
    |
    (\w+)?(:)        converter colon
    |
    (>)              html
    |
    (\*)             codeTag
  )
  \s*
  (                  params
    (?:[^}]|}(?!}))*?
  )
  (\/)?              slash
  |
  {(\^)?{            bind2
  (?:
    (?:\/(\w+))\s*   closeBlock
    |
    !--[\s\S]*?--    comment
  )
)
}}/g

*/
		if (codeTag && bind || slash && !tagName || params && params.slice(-1) === ":" || bind2) {
			syntaxError(all);
		}

		// Build abstract syntax tree (AST): [tagName, converter, params, content, hash, bindings, contentMarkup]
		if (html) {
			colon = ":";
			converter = HTML;
		}
		slash = slash || isLinkExpr && !hasElse;

		var late, openTagName, isLateOb,
			pathBindings = (bind || isLinkExpr) && [[]], // pathBindings is an array of arrays for arg bindings and a hash of arrays for prop bindings
			props = "",
			args = "",
			ctxProps = "",
			paramsArgs = "",
			paramsProps = "",
			paramsCtxProps = "",
			onError = "",
			useTrigger = "",
			// Block tag if not self-closing and not {{:}} or {{>}} (special case) and not a data-link expression
			block = !slash && !colon;

		//==== nested helper function ====
		tagName = tagName || (params = params || "#data", colon); // {{:}} is equivalent to {{:#data}}
		pushprecedingContent(index);
		loc = index + all.length; // location marker - parsed up to here
		if (codeTag) {
			if (allowCode) {
				content.push(["*", "\n" + params.replace(/^:/, "ret+= ").replace(rUnescapeQuotes, "$1") + ";\n"]);
			}
		} else if (tagName) {
			if (tagName === "else") {
				if (rTestElseIf.test(params)) {
					syntaxError('For "{{else if expr}}" use "{{else expr}}"');
				}
				pathBindings = current[9] && [[]];
				current[10] = markup.substring(current[10], index); // contentMarkup for block tag
				openTagName = current[11] || current[0] || syntaxError("Mismatched: " + all);
				// current[0] is tagName, but for {{else}} nodes, current[11] is tagName of preceding open tag
				current = stack.pop();
				content = current[2];
				block = true;
			}
			if (params) {
				// remove newlines from the params string, to avoid compiled code errors for unterminated strings
				parseParams(params.replace(rNewLine, " "), pathBindings, tmpl, isLinkExpr)
					.replace(rBuildHash, function(all, onerror, isCtxPrm, key, keyToken, keyValue, arg, param) {
						if (key === "this:") {
							keyValue = "undefined"; // this=some.path is always a to parameter (one-way), so don't need to compile/evaluate some.path initialization
						}
						if (param) {
							isLateOb = isLateOb || param[0] === "@";
						}
						key = "'" + keyToken + "':";
						if (arg) {
							args += isCtxPrm + keyValue + ",";
							paramsArgs += "'" + param + "',";
						} else if (isCtxPrm) { // Contextual parameter, ~foo=expr
							ctxProps += key + 'j._cp(' + keyValue + ',"' + param + '",view),';
							// Compiled code for evaluating tagCtx on a tag will have: ctx:{'foo':j._cp(compiledExpr, "expr", view)}
							paramsCtxProps += key + "'" + param + "',";
						} else if (onerror) {
							onError += keyValue;
						} else {
							if (keyToken === "trigger") {
								useTrigger += keyValue;
							}
							if (keyToken === "lateRender") {
								late = param !== "false"; // Render after first pass
							}
							props += key + keyValue + ",";
							paramsProps += key + "'" + param + "',";
							hasHandlers = hasHandlers || rHasHandlers.test(keyToken);
						}
						return "";
					}).slice(0, -1);
			}

			if (pathBindings && pathBindings[0]) {
				pathBindings.pop(); // Remove the binding that was prepared for next arg. (There is always an extra one ready).
			}

			newNode = [
					tagName,
					converter || !!convertBack || hasHandlers || "",
					block && [],
					parsedParam(paramsArgs || (tagName === ":" ? "'#data'," : ""), paramsProps, paramsCtxProps), // {{:}} equivalent to {{:#data}}
					parsedParam(args || (tagName === ":" ? "data," : ""), props, ctxProps),
					onError,
					useTrigger,
					late,
					isLateOb,
					pathBindings || 0
				];
			content.push(newNode);
			if (block) {
				stack.push(current);
				current = newNode;
				current[10] = loc; // Store current location of open tag, to be able to add contentMarkup when we reach closing tag
				current[11] = openTagName; // Used for checking syntax (matching close tag)
			}
		} else if (closeBlock) {
			blockTagCheck(closeBlock !== current[0] && closeBlock !== current[11] && closeBlock, current[0]); // Check matching close tag name
			current[10] = markup.substring(current[10], index); // contentMarkup for block tag
			current = stack.pop();
		}
		blockTagCheck(!current && closeBlock);
		content = current[2];
	}
	//==== /end of nested functions ====

	var i, result, newNode, hasHandlers, bindings,
		allowCode = $subSettings.allowCode || tmpl && tmpl.allowCode
			|| $viewsSettings.allowCode === true, // include direct setting of settings.allowCode true for backward compat only
		astTop = [],
		loc = 0,
		stack = [],
		content = astTop,
		current = [,,astTop];

	if (allowCode && tmpl._is) {
		tmpl.allowCode = allowCode;
	}

//TODO	result = tmplFnsCache[markup]; // Only cache if template is not named and markup length < ...,
//and there are no bindings or subtemplates?? Consider standard optimization for data-link="a.b.c"
//		if (result) {
//			tmpl.fn = result;
//		} else {

//		result = markup;
	if (isLinkExpr) {
		if (convertBack !== undefined) {
			markup = markup.slice(0, -convertBack.length - 2) + delimCloseChar0;
		}
		markup = delimOpenChar0 + markup + delimCloseChar1;
	}

	blockTagCheck(stack[0] && stack[0][2].pop()[0]);
	// Build the AST (abstract syntax tree) under astTop
	markup.replace(rTag, parseTag);

	pushprecedingContent(markup.length);

	if (loc = astTop[astTop.length - 1]) {
		blockTagCheck(typeof loc !== STRING && (+loc[10] === loc[10]) && loc[0]);
	}
//			result = tmplFnsCache[markup] = buildCode(astTop, tmpl);
//		}

	if (isLinkExpr) {
		result = buildCode(astTop, markup, isLinkExpr);
		bindings = [];
		i = astTop.length;
		while (i--) {
			bindings.unshift(astTop[i][9]); // With data-link expressions, pathBindings array for tagCtx[i] is astTop[i][9]
		}
		setPaths(result, bindings);
	} else {
		result = buildCode(astTop, tmpl);
	}
	return result;
}

function setPaths(fn, pathsArr) {
	var key, paths,
		i = 0,
		l = pathsArr.length;
	fn.deps = [];
	fn.paths = []; // The array of path binding (array/dictionary)s for each tag/else block's args and props
	for (; i < l; i++) {
		fn.paths.push(paths = pathsArr[i]);
		for (key in paths) {
			if (key !== "_jsvto" && paths.hasOwnProperty(key) && paths[key].length && !paths[key].skp) {
				fn.deps = fn.deps.concat(paths[key]); // deps is the concatenation of the paths arrays for the different bindings
			}
		}
	}
}

function parsedParam(args, props, ctx) {
	return [args.slice(0, -1), props.slice(0, -1), ctx.slice(0, -1)];
}

function paramStructure(paramCode, paramVals) {
	return '\n\tparams:{args:[' + paramCode[0] + '],\n\tprops:{' + paramCode[1] + '}'
		+ (paramCode[2] ? ',\n\tctx:{' + paramCode[2] + '}' : "")
		+ '},\n\targs:[' + paramVals[0] + '],\n\tprops:{' + paramVals[1] + '}'
		+ (paramVals[2] ? ',\n\tctx:{' + paramVals[2] + '}' : "");
}

function parseParams(params, pathBindings, tmpl, isLinkExpr) {

	function parseTokens(all, lftPrn0, lftPrn, bound, path, operator, err, eq, path2, late, prn,
												comma, lftPrn2, apos, quot, rtPrn, rtPrnDot, prn2, space, index, full) {
	// /(\()(?=\s*\()|(?:([([])\s*)?(?:(\^?)(~?[\w$.^]+)?\s*((\+\+|--)|\+|-|~(?![\w$])|&&|\|\||===|!==|==|!=|<=|>=|[<>%*:?\/]|(=))\s*|(!*?(@)?[#~]?[\w$.^]+)([([])?)|(,\s*)|(?:(\()\s*)?\\?(?:(')|("))|(?:\s*(([)\]])(?=[.^]|\s*$|[^([])|[)\]])([([]?))|(\s+)/g,
	//lftPrn0           lftPrn         bound     path               operator     err                                          eq      path2 late            prn      comma  lftPrn2          apos quot        rtPrn  rtPrnDot                  prn2     space
	// (left paren? followed by (path? followed by operator) or (path followed by paren?)) or comma or apos or quot or right paren or space

		function parsePath(allPath, not, object, helper, view, viewProperty, pathTokens, leafToken) {
			// /^(!*?)(?:null|true|false|\d[\d.]*|([\w$]+|\.|~([\w$]+)|#(view|([\w$]+))?)([\w$.^]*?)(?:[.[^]([\w$]+)\]?)?)$/g,
			//    not                               object     helper    view  viewProperty pathTokens      leafToken
			subPath = object === ".";
			if (object) {
				path = path.slice(not.length);
				if (/^\.?constructor$/.test(leafToken||path)) {
					syntaxError(allPath);
				}
				if (!subPath) {
					allPath = (late // late path @a.b.c: not throw on 'property of undefined' if a undefined, and will use _getOb() after linking to resolve late.
							? (isLinkExpr ? '' : '(ltOb.lt=ltOb.lt||') + '(ob='
							: ""
						)
						+ (helper
							? 'view.ctxPrm("' + helper + '")'
							: view
								? "view"
								: "data")
						+ (late
							? ')===undefined' + (isLinkExpr ? '' : ')') + '?"":view._getOb(ob,"'
							: ""
						)
						+ (leafToken
							? (viewProperty
								? "." + viewProperty
								: helper
									? ""
									: (view ? "" : "." + object)
								) + (pathTokens || "")
							: (leafToken = helper ? "" : view ? viewProperty || "" : object, ""));
					allPath = allPath + (leafToken ? "." + leafToken : "");

					allPath = not + (allPath.slice(0, 9) === "view.data"
						? allPath.slice(5) // convert #view.data... to data...
						: allPath)
					+ (late
							? (isLinkExpr ? '"': '",ltOb') + (prn ? ',1)':')')
							: ""
						);
				}
				if (bindings) {
					binds = named === "_linkTo" ? (bindto = pathBindings._jsvto = pathBindings._jsvto || []) : bndCtx.bd;
					if (theOb = subPath && binds[binds.length-1]) {
						if (theOb._cpfn) { // Computed property exprOb
							while (theOb.sb) {
								theOb = theOb.sb;
							}
							if (theOb.prm) {
								if (theOb.bnd) {
									path = "^" + path.slice(1);
								}
								theOb.sb = path;
								theOb.bnd = theOb.bnd || path[0] === "^";
							}
						}
					} else {
						binds.push(path);
					}
					if (prn && !subPath) {
						pathStart[fnDp] = ind;
						compiledPathStart[fnDp] = compiledPath[fnDp].length;
					}
				}
			}
			return allPath;
		}

		//bound = bindings && bound;
		if (bound && !eq) {
			path = bound + path; // e.g. some.fn(...)^some.path - so here path is "^some.path"
		}
		operator = operator || "";
		lftPrn2 = lftPrn2 || "";
		lftPrn = lftPrn || lftPrn0 || lftPrn2;
		path = path || path2;

		if (late && (late = !/\)|]/.test(full[index-1]))) {
			path = path.slice(1).split(".").join("^"); // Late path @z.b.c. Use "^" rather than "." to ensure that deep binding will be used
		}
		// Could do this - but not worth perf cost?? :-
		// if (!path.lastIndexOf("#data.", 0)) { path = path.slice(6); } // If path starts with "#data.", remove that.
		prn = prn || prn2 || "";
		var expr, binds, theOb, newOb, subPath, lftPrnFCall, ret,
			ind = index;

		if (!aposed && !quoted) {
			if (err) {
				syntaxError(params);
			}
			if (rtPrnDot && bindings) {
				// This is a binding to a path in which an object is returned by a helper/data function/expression, e.g. foo()^x.y or (a?b:c)^x.y
				// We create a compiled function to get the object instance (which will be called when the dependent data of the subexpression changes,
				// to return the new object, and trigger re-binding of the subsequent path)
				expr = pathStart[fnDp-1];
				if (full.length - 1 > ind - (expr || 0)) { // We need to compile a subexpression
					expr = $.trim(full.slice(expr, ind + all.length));
					binds = bindto || bndStack[fnDp-1].bd;
					// Insert exprOb object, to be used during binding to return the computed object
					theOb = binds[binds.length-1];
					if (theOb && theOb.prm) {
						while (theOb.sb && theOb.sb.prm) {
							theOb = theOb.sb;
						}
						newOb = theOb.sb = {path: theOb.sb, bnd: theOb.bnd};
					} else {
						binds.push(newOb = {path: binds.pop()}); // Insert exprOb object, to be used during binding to return the computed object
					}
					if (theOb && theOb.sb === newOb) {
						compiledPath[fnDp] = compiledPath[fnDp-1].slice(theOb._cpPthSt) + compiledPath[fnDp];
						compiledPath[fnDp-1] = compiledPath[fnDp-1].slice(0, theOb._cpPthSt);
					}
					newOb._cpPthSt = compiledPathStart[fnDp-1];
					newOb._cpKey = expr;

					compiledPath[fnDp] += full.slice(prevIndex, index);
					prevIndex = index;

					newOb._cpfn = cpFnStore[expr] = cpFnStore[expr] || // Compiled function for computed value: get from store, or compile and store
						new Function("data,view,j", // Compiled function for computed value in template
					"//" + expr + "\nvar v;\nreturn ((v=" + compiledPath[fnDp] + (rtPrn === "]" ? ")]" : rtPrn) + ")!=null?v:null);");

					compiledPath[fnDp-1] += (fnCall[prnDp] && $subSettingsAdvanced.cache ? "view.getCache(\"" + expr.replace(rEscapeQuotes, "\\$&") + "\"" : compiledPath[fnDp]);

					newOb.prm = bndCtx.bd;
					newOb.bnd = newOb.bnd || newOb.path && newOb.path.indexOf("^") >= 0;
				}
				compiledPath[fnDp] = "";
			}
			if (prn === "[") {
				prn = "[j._sq(";
			}
			if (lftPrn === "[") {
				lftPrn = "[j._sq(";
			}
		}
		ret = (aposed
			// within single-quoted string
			? (aposed = !apos, (aposed ? all : lftPrn2 + '"'))
			: quoted
			// within double-quoted string
				? (quoted = !quot, (quoted ? all : lftPrn2 + '"'))
				:
			(
				(lftPrn
					? (
						prnStack[++prnDp] = true,
						prnInd[prnDp] = 0,
						bindings && (
							pathStart[fnDp++] = ind++,
							bndCtx = bndStack[fnDp] = {bd: []},
							compiledPath[fnDp] = "",
							compiledPathStart[fnDp] = 1
						),
						lftPrn) // Left paren, (not a function call paren)
					: "")
				+ (space
					? (prnDp
						? "" // A space within parens or within function call parens, so not a separator for tag args
			// New arg or prop - so insert backspace \b (\x08) as separator for named params, used subsequently by rBuildHash, and prepare new bindings array
						: (paramIndex = full.slice(paramIndex, ind), named
							? (named = boundName = bindto = false, "\b")
							: "\b,") + paramIndex + (paramIndex = ind + all.length, bindings && pathBindings.push(bndCtx.bd = []), "\b")
					)
					: eq
			// named param. Remove bindings for arg and create instead bindings array for prop
						? (fnDp && syntaxError(params), bindings && pathBindings.pop(), named = "_" + path, boundName = bound, paramIndex = ind + all.length,
								bindings && ((bindings = bndCtx.bd = pathBindings[named] = []), bindings.skp = !bound), path + ':')
						: path
			// path
							? (path.split("^").join(".").replace($sub.rPath, parsePath)
								+ (prn || operator)
							)
							: operator
			// operator
								? operator
								: rtPrn
			// function
									? rtPrn === "]" ? ")]" : ")"
									: comma
										? (fnCall[prnDp] || syntaxError(params), ",") // We don't allow top-level literal arrays or objects
										: lftPrn0
											? ""
											: (aposed = apos, quoted = quot, '"')
			))
		);

		if (!aposed && !quoted) {
			if (rtPrn) {
				fnCall[prnDp] = false;
				prnDp--;
			}
		}

		if (bindings) {
			if (!aposed && !quoted) {
				if (rtPrn) {
					if (prnStack[prnDp+1]) {
						bndCtx = bndStack[--fnDp];
						prnStack[prnDp+1] = false;
					}
					prnStart = prnInd[prnDp+1];
				}
				if (prn) {
					prnInd[prnDp+1] = compiledPath[fnDp].length + (lftPrn ? 1 : 0);
					if (path || rtPrn) {
						bndCtx = bndStack[++fnDp] = {bd: []};
						prnStack[prnDp+1] = true;
					}
				}
			}

			compiledPath[fnDp] = (compiledPath[fnDp]||"") + full.slice(prevIndex, index);
			prevIndex = index+all.length;

			if (!aposed && !quoted) {
				if (lftPrnFCall = lftPrn && prnStack[prnDp+1]) {
					compiledPath[fnDp-1] += lftPrn;
					compiledPathStart[fnDp-1]++;
				}
				if (prn === "(" && subPath && !newOb) {
					compiledPath[fnDp] = compiledPath[fnDp-1].slice(prnStart) + compiledPath[fnDp];
					compiledPath[fnDp-1] = compiledPath[fnDp-1].slice(0, prnStart);
				}
			}
			compiledPath[fnDp] += lftPrnFCall ? ret.slice(1) : ret;
		}

		if (!aposed && !quoted && prn) {
			prnDp++;
			if (path && prn === "(") {
				fnCall[prnDp] = true;
			}
		}

		if (!aposed && !quoted && prn2) {
			if (bindings) {
				compiledPath[fnDp] += prn;
			}
			ret += prn;
		}
		return ret;
	}

	var named, bindto, boundName, result,
		quoted, // boolean for string content in double quotes
		aposed, // or in single quotes
		bindings = pathBindings && pathBindings[0], // bindings array for the first arg
		bndCtx = {bd: bindings},
		bndStack = {0: bndCtx},
		paramIndex = 0, // list,
		// The following are used for tracking path parsing including nested paths, such as "a.b(c^d + (e))^f", and chained computed paths such as
		// "a.b().c^d().e.f().g" - which has four chained paths, "a.b()", "^c.d()", ".e.f()" and ".g"
		prnDp = 0,     // For tracking paren depth (not function call parens)
		fnDp = 0,      // For tracking depth of function call parens
		prnInd = {},   // We are in a function call
		prnStart = 0,  // tracks the start of the current path such as c^d() in the above example
		prnStack = {}, // tracks parens which are not function calls, and so are associated with new bndStack contexts
		fnCall = {},   // We are in a function call
		pathStart = {},// tracks the start of the current path such as c^d() in the above example
		compiledPathStart = {0: 0},
		compiledPath = {0:""},
		prevIndex = 0;

	if (params[0] === "@") {
		params = params.replace(rBracketQuote, ".");
	}
	result = (params + (tmpl ? " " : "")).replace($sub.rPrm, parseTokens);

	if (bindings) {
		result = compiledPath[0];
	}

	return !prnDp && result || syntaxError(params); // Syntax error if unbalanced parens in params expression
}

function buildCode(ast, tmpl, isLinkExpr) {
	// Build the template function code from the AST nodes, and set as property on the passed-in template object
	// Used for compiling templates, and also by JsViews to build functions for data link expressions
	var i, node, tagName, converter, tagCtx, hasTag, hasEncoder, getsVal, hasCnvt, useCnvt, tmplBindings, pathBindings, params, boundOnErrStart,
		boundOnErrEnd, tagRender, nestedTmpls, tmplName, nestedTmpl, tagAndElses, content, markup, nextIsElse, oldCode, isElse, isGetVal, tagCtxFn,
		onError, tagStart, trigger, lateRender, retStrOpen, retStrClose,
		tmplBindingKey = 0,
		useViews = $subSettingsAdvanced.useViews || tmpl.useViews || tmpl.tags || tmpl.templates || tmpl.helpers || tmpl.converters,
		code = "",
		tmplOptions = {},
		l = ast.length;

	if (typeof tmpl === STRING) {
		tmplName = isLinkExpr ? 'data-link="' + tmpl.replace(rNewLine, " ").slice(1, -1) + '"' : tmpl;
		tmpl = 0;
	} else {
		tmplName = tmpl.tmplName || "unnamed";
		if (tmpl.allowCode) {
			tmplOptions.allowCode = true;
		}
		if (tmpl.debug) {
			tmplOptions.debug = true;
		}
		tmplBindings = tmpl.bnds;
		nestedTmpls = tmpl.tmpls;
	}
	for (i = 0; i < l; i++) {
		// AST nodes: [0: tagName, 1: converter, 2: content, 3: params, 4: code, 5: onError, 6: trigger, 7:pathBindings, 8: contentMarkup]
		node = ast[i];

		// Add newline for each callout to t() c() etc. and each markup string
		if (typeof node === STRING) {
			// a markup string to be inserted
			code += '+"' + node + '"';
		} else {
			// a compiled tag expression to be inserted
			tagName = node[0];
			if (tagName === "*") {
				// Code tag: {{* }}
				code += ";\n" + node[1] + "\nret=ret";
			} else {
				converter = node[1];
				content = !isLinkExpr && node[2];
				tagCtx = paramStructure(node[3], params = node[4]);
				trigger = node[6];
				lateRender = node[7];
				if (node[8]) { // latePath @a.b.c or @~a.b.c
					retStrOpen = "\nvar ob,ltOb={},ctxs=";
					retStrClose = ";\nctxs.lt=ltOb.lt;\nreturn ctxs;";
				} else {
					retStrOpen = "\nreturn ";
					retStrClose = "";
				}
				markup = node[10] && node[10].replace(rUnescapeQuotes, "$1");
				if (isElse = tagName === "else") {
					if (pathBindings) {
						pathBindings.push(node[9]);
					}
				} else {
					onError = node[5] || $subSettings.debugMode !== false && "undefined"; // If debugMode not false, set default onError handler on tag to "undefined" (see onRenderError)
					if (tmplBindings && (pathBindings = node[9])) { // Array of paths, or false if not data-bound
						pathBindings = [pathBindings];
						tmplBindingKey = tmplBindings.push(1); // Add placeholder in tmplBindings for compiled function
					}
				}
				useViews = useViews || params[1] || params[2] || pathBindings || /view.(?!index)/.test(params[0]);
				// useViews is for perf optimization. For render() we only use views if necessary - for the more advanced scenarios.
				// We use views if there are props, contextual properties or args with #... (other than #index) - but you can force
				// using the full view infrastructure, (and pay a perf price) by opting in: Set useViews: true on the template, manually...
				if (isGetVal = tagName === ":") {
					if (converter) {
						tagName = converter === HTML ? ">" : converter + tagName;
					}
				} else {
					if (content) { // TODO optimize - if content.length === 0 or if there is a tmpl="..." specified - set content to null / don't run this compilation code - since content won't get used!!
						// Create template object for nested template
						nestedTmpl = tmplObject(markup, tmplOptions);
						nestedTmpl.tmplName = tmplName + "/" + tagName;
						// Compile to AST and then to compiled function
						nestedTmpl.useViews = nestedTmpl.useViews || useViews;
						buildCode(content, nestedTmpl);
						useViews = nestedTmpl.useViews;
						nestedTmpls.push(nestedTmpl);
					}

					if (!isElse) {
						// This is not an else tag.
						tagAndElses = tagName;
						useViews = useViews || tagName && (!$tags[tagName] || !$tags[tagName].flow);
						// Switch to a new code string for this bound tag (and its elses, if it has any) - for returning the tagCtxs array
						oldCode = code;
						code = "";
					}
					nextIsElse = ast[i + 1];
					nextIsElse = nextIsElse && nextIsElse[0] === "else";
				}
				tagStart = onError ? ";\ntry{\nret+=" : "\n+";
				boundOnErrStart = "";
				boundOnErrEnd = "";

				if (isGetVal && (pathBindings || trigger || converter && converter !== HTML || lateRender)) {
					// For convertVal we need a compiled function to return the new tagCtx(s)
					tagCtxFn = new Function("data,view,j", "// " + tmplName + " " + (++tmplBindingKey) + " " + tagName
						+ retStrOpen + "{" + tagCtx + "};" + retStrClose);
					tagCtxFn._er = onError;
					tagCtxFn._tag = tagName;
					tagCtxFn._bd = !!pathBindings; // data-linked tag {^{.../}}
					tagCtxFn._lr = lateRender;

					if (isLinkExpr) {
						return tagCtxFn;
					}

					setPaths(tagCtxFn, pathBindings);
					tagRender = 'c("' + converter + '",view,';
					useCnvt = true;
					boundOnErrStart = tagRender + tmplBindingKey + ",";
					boundOnErrEnd = ")";
				}
				code += (isGetVal
					? (isLinkExpr ? (onError ? "try{\n" : "") + "return " : tagStart) + (useCnvt // Call _cnvt if there is a converter: {{cnvt: ... }} or {^{cnvt: ... }}
						? (useCnvt = undefined, useViews = hasCnvt = true, tagRender + (tagCtxFn
							? ((tmplBindings[tmplBindingKey - 1] = tagCtxFn), tmplBindingKey) // Store the compiled tagCtxFn in tmpl.bnds, and pass the key to convertVal()
							: "{" + tagCtx + "}") + ")")
						: tagName === ">"
							? (hasEncoder = true, "h(" + params[0] + ")")
							: (getsVal = true, "((v=" + params[0] + ')!=null?v:' + (isLinkExpr ? 'null)' : '"")'))
							// Non strict equality so data-link="title{:expr}" with expr=null/undefined removes title attribute
					)
					: (hasTag = true, "\n{view:view,content:false,tmpl:" // Add this tagCtx to the compiled code for the tagCtxs to be passed to renderTag()
						+ (content ? nestedTmpls.length : "false") + "," // For block tags, pass in the key (nestedTmpls.length) to the nested content template
						+ tagCtx + "},"));

				if (tagAndElses && !nextIsElse) {
					// This is a data-link expression or an inline tag without any elses, or the last {{else}} of an inline tag
					// We complete the code for returning the tagCtxs array
					code = "[" + code.slice(0, -1) + "]";
					tagRender = 't("' + tagAndElses + '",view,this,';
					if (isLinkExpr || pathBindings) {
						// This is a bound tag (data-link expression or inline bound tag {^{tag ...}}) so we store a compiled tagCtxs function in tmp.bnds
						code = new Function("data,view,j", " // " + tmplName + " " + tmplBindingKey + " " + tagAndElses + retStrOpen + code
							+ retStrClose);
						code._er = onError;
						code._tag = tagAndElses;
						if (pathBindings) {
							setPaths(tmplBindings[tmplBindingKey - 1] = code, pathBindings);
						}
						code._lr = lateRender;
						if (isLinkExpr) {
							return code; // For a data-link expression we return the compiled tagCtxs function
						}
						boundOnErrStart = tagRender + tmplBindingKey + ",undefined,";
						boundOnErrEnd = ")";
					}

					// This is the last {{else}} for an inline tag.
					// For a bound tag, pass the tagCtxs fn lookup key to renderTag.
					// For an unbound tag, include the code directly for evaluating tagCtxs array
					code = oldCode + tagStart + tagRender + (pathBindings && tmplBindingKey || code) + ")";
					pathBindings = 0;
					tagAndElses = 0;
				}
				if (onError && !nextIsElse) {
					useViews = true;
					code += ';\n}catch(e){ret' + (isLinkExpr ? "urn " : "+=") + boundOnErrStart + 'j._err(e,view,' + onError + ')' + boundOnErrEnd + ';}' + (isLinkExpr ? "" : '\nret=ret');
				}
			}
		}
	}
	// Include only the var references that are needed in the code
	code = "// " + tmplName
		+ (tmplOptions.debug ? "\ndebugger;" : "")
		+ "\nvar v"
		+ (hasTag ? ",t=j._tag" : "")                // has tag
		+ (hasCnvt ? ",c=j._cnvt" : "")              // converter
		+ (hasEncoder ? ",h=j._html" : "")           // html converter
		+ (isLinkExpr
				? (node[8] // late @... path?
						? ", ob"
						: ""
					) + ";\n"
				: ',ret=""')
		+ code
		+ (isLinkExpr ? "\n" : ";\nreturn ret;");

	try {
		code = new Function("data,view,j", code);
	} catch (e) {
		syntaxError("Compiled template code:\n\n" + code + '\n: "' + (e.message||e) + '"');
	}
	if (tmpl) {
		tmpl.fn = code;
		tmpl.useViews = !!useViews;
	}
	return code;
}

//==========
// Utilities
//==========

// Merge objects, in particular contexts which inherit from parent contexts
function extendCtx(context, parentContext) {
	// Return copy of parentContext, unless context is defined and is different, in which case return a new merged context
	// If neither context nor parentContext are defined, return undefined
	return context && context !== parentContext
		? (parentContext
			? $extend($extend({}, parentContext), context)
			: context)
		: parentContext && $extend({}, parentContext);
}

function getTargetProps(source, tagCtx) {
	// this pointer is theMap - which has tagCtx.props too
	// arguments: tagCtx.args.
	var key, prop,
		map = tagCtx.map,
		propsArr = map && map.propsArr;

	if (!propsArr) { // map.propsArr is the full array of {key:..., prop:...} objects
		propsArr = [];
		if (typeof source === OBJECT || $isFunction(source)) {
			for (key in source) {
				prop = source[key];
				if (key !== $expando && source.hasOwnProperty(key) && (!tagCtx.props.noFunctions || !$.isFunction(prop))) {
					propsArr.push({key: key, prop: prop});
				}
			}
		}
		if (map) {
			map.propsArr = map.options && propsArr; // If bound {^{props}} and not isRenderCall, store propsArr on map (map.options is defined only for bound, && !isRenderCall)
		}
	}
	return getTargetSorted(propsArr, tagCtx); // Obtains map.tgt, by filtering, sorting and splicing the full propsArr
}

function getTargetSorted(value, tagCtx) {
	// getTgt
	var mapped, start, end,
		tag = tagCtx.tag,
		props = tagCtx.props,
		propParams = tagCtx.params.props,
		filter = props.filter,
		sort = props.sort,
		directSort = sort === true,
		step = parseInt(props.step),
		reverse = props.reverse ? -1 : 1;

	if (!$isArray(value)) {
		return value;
	}
	if (directSort || sort && typeof sort === STRING) {
		// Temporary mapped array holds objects with index and sort-value
		mapped = value.map(function(item, i) {
			item = directSort ? item : getPathObject(item, sort);
			return {i: i, v: typeof item === STRING ? item.toLowerCase() : item};
		});
		// Sort mapped array
		mapped.sort(function(a, b) {
			return a.v > b.v ? reverse : a.v < b.v ? -reverse : 0;
		});
		// Map to new array with resulting order
		value = mapped.map(function(item){
			return value[item.i];
		});
	} else if ((sort || reverse < 0) && !tag.dataMap) {
		value = value.slice(); // Clone array first if not already a new array
	}
	if ($isFunction(sort)) {
		value = value.sort(function() { // Wrap the sort function to provide tagCtx as 'this' pointer
			return sort.apply(tagCtx, arguments);
		});
	}
	if (reverse < 0 && (!sort || $isFunction(sort))) { // Reverse result if not already reversed in sort
		value = value.reverse();
	}

	if (value.filter && filter) { // IE8 does not support filter
		value = value.filter(filter, tagCtx);
		if (tagCtx.tag.onFilter) {
			tagCtx.tag.onFilter(tagCtx);
		}
	}

	if (propParams.sorted) {
		mapped = (sort || reverse < 0) ? value : value.slice();
		if (tag.sorted) {
			$.observable(tag.sorted).refresh(mapped); // Note that this might cause the start and end props to be modified - e.g. by pager tag control
		} else {
			tagCtx.map.sorted = mapped;
		}
	}

	start = props.start; // Get current value - after possible changes triggered by tag.sorted refresh() above
	end = props.end;
	if (propParams.start && start === undefined || propParams.end && end === undefined) {
		start = end = 0;
	}
	if (!isNaN(start) || !isNaN(end)) { // start or end specified, but not the auto-create Number array scenario of {{for start=xxx end=yyy}}
		start = +start || 0;
		end = end === undefined || end > value.length ? value.length : +end;
		value = value.slice(start, end);
	}
	if (step > 1) {
		start = 0;
		end = value.length;
		mapped = [];
		for (; start<end; start+=step) {
			mapped.push(value[start]);
		}
		value = mapped;
	}
	if (propParams.paged && tag.paged) {
		$observable(tag.paged).refresh(value);
	}

	return value;
}

/** Render the template as a string, using the specified data and helpers/context
* $("#tmpl").render()
*
* @param {any}        data
* @param {hash}       [helpersOrContext]
* @param {boolean}    [noIteration]
* @returns {string}   rendered template
*/
function $fnRender(data, context, noIteration) {
	var tmplElem = this.jquery && (this[0] || error('Unknown template')), // Targeted element not found for jQuery template selector such as "#myTmpl"
		tmpl = tmplElem.getAttribute(tmplAttr);

	return renderContent.call(tmpl && $.data(tmplElem)[jsvTmpl] || $templates(tmplElem),
		data, context, noIteration);
}

//========================== Register converters ==========================

function getCharEntity(ch) {
	// Get character entity for HTML, Attribute and optional data encoding
	return charEntities[ch] || (charEntities[ch] = "&#" + ch.charCodeAt(0) + ";");
}

function getCharFromEntity(match, token) {
	// Get character from HTML entity, for optional data unencoding
	return charsFromEntities[token] || "";
}

function htmlEncode(text) {
	// HTML encode: Replace < > & ' " ` etc. by corresponding entities.
	return text != undefined ? rIsHtml.test(text) && ("" + text).replace(rHtmlEncode, getCharEntity) || text : "";
}

function dataEncode(text) {
	// Encode just < > and & - intended for 'safe data' along with {{:}} rather than {{>}}
  return typeof text === STRING ? text.replace(rDataEncode, getCharEntity) : text;
}

function dataUnencode(text) {
  // Unencode just < > and & - intended for 'safe data' along with {{:}} rather than {{>}}
  return  typeof text === STRING ? text.replace(rDataUnencode, getCharFromEntity) : text;
}

//========================== Initialize ==========================

$sub = $views.sub;
$viewsSettings = $views.settings;

if (!(jsr || $ && $.render)) {
	// JsRender/JsViews not already loaded (or loaded without jQuery, and we are now moving from jsrender namespace to jQuery namepace)
	for (jsvStoreName in jsvStores) {
		registerStore(jsvStoreName, jsvStores[jsvStoreName]);
	}

	$converters = $views.converters;
	$helpers = $views.helpers;
	$tags = $views.tags;

	$sub._tg.prototype = {
		baseApply: baseApply,
		cvtArgs: convertArgs,
		bndArgs: convertBoundArgs,
		ctxPrm: contextParameter
	};

	topView = $sub.topView = new View();

	//BROWSER-SPECIFIC CODE
	if ($) {

		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery (= $) is loaded

		$.fn.render = $fnRender;
		$expando = $.expando;
		if ($.observable) {
			if (versionNumber !== (versionNumber = $.views.jsviews)) {
				// Different version of jsRender was loaded
				throw "jquery.observable.js requires jsrender.js " + versionNumber;
			}
			$extend($sub, $.views.sub); // jquery.observable.js was loaded before jsrender.js
			$views.map = $.views.map;
		}

	} else {
		////////////////////////////////////////////////////////////////////////////////////////////////
		// jQuery is not loaded.

		$ = {};

		if (setGlobals) {
			global.jsrender = $; // We are loading jsrender.js from a script element, not AMD or CommonJS, so set global
		}

		// Error warning if jsrender.js is used as template engine on Node.js (e.g. Express or Hapi...)
		// Use jsrender-node.js instead...
		$.renderFile = $.__express = $.compile = function() { throw "Node.js: use npm jsrender, or jsrender-node.js"; };

		//END BROWSER-SPECIFIC CODE
		$.isFunction = function(ob) {
			return typeof ob === "function";
		};

		$.isArray = Array.isArray || function(obj) {
			return ({}.toString).call(obj) === "[object Array]";
		};

		$sub._jq = function(jq) { // private method to move from JsRender APIs from jsrender namespace to jQuery namespace
			if (jq !== $) {
				$extend(jq, $); // map over from jsrender namespace to jQuery namespace
				$ = jq;
				$.fn.render = $fnRender;
				delete $.jsrender;
				$expando = $.expando;
			}
		};

		$.jsrender = versionNumber;
	}
	$subSettings = $sub.settings;
	$subSettings.allowCode = false;
	$isFunction = $.isFunction;
	$.render = $render;
	$.views = $views;
	$.templates = $templates = $views.templates;

	for (setting in $subSettings) {
		addSetting(setting);
	}

	/**
	* $.views.settings.debugMode(true)
	* @param {boolean} debugMode
	* @returns {Settings}
	*
	* debugMode = $.views.settings.debugMode()
	* @returns {boolean}
	*/
	($viewsSettings.debugMode = function(debugMode) {
		return debugMode === undefined
			? $subSettings.debugMode
			: (
				$subSettings._clFns && $subSettings._clFns(), // Clear linkExprStore (cached compiled expressions), since debugMode setting affects compilation for expressions
				$subSettings.debugMode = debugMode,
				$subSettings.onError = typeof debugMode === STRING
					? function() { return debugMode; }
					: $isFunction(debugMode)
						? debugMode
						: undefined,
				$viewsSettings);
	})(false); // jshint ignore:line

	$subSettingsAdvanced = $subSettings.advanced = {
		cache: true, // By default use cached values of computed values (Otherwise, set advanced cache setting to false)
		useViews: false,
		_jsv: false // For global access to JsViews store
	};

	//========================== Register tags ==========================

	$tags({
		"if": {
			render: function(val) {
				// This function is called once for {{if}} and once for each {{else}}.
				// We will use the tag.rendering object for carrying rendering state across the calls.
				// If not done (a previous block has not been rendered), look at expression for this block and render the block if expression is truthy
				// Otherwise return ""
				var self = this,
					tagCtx = self.tagCtx,
					ret = (self.rendering.done || !val && (tagCtx.args.length || !tagCtx.index))
						? ""
						: (self.rendering.done = true,
							self.selected = tagCtx.index,
							undefined); // Test is satisfied, so render content on current context
				return ret;
			},
			contentCtx: true, // Inherit parent view data context
			flow: true
		},
		"for": {
			sortDataMap: dataMap(getTargetSorted),
			init: function(val, cloned) {
				this.setDataMap(this.tagCtxs);
			},
			render: function(val) {
				// This function is called once for {{for}} and once for each {{else}}.
				// We will use the tag.rendering object for carrying rendering state across the calls.
				var value, filter, srtField, isArray, i, sorted, end, step,
					self = this,
					tagCtx = self.tagCtx,
					range = tagCtx.argDefault === false,
					props = tagCtx.props,
					iterate = range || tagCtx.args.length, // Not final else and not auto-create range
					result = "",
					done = 0;

				if (!self.rendering.done) {
					value = iterate ? val : tagCtx.view.data; // For the final else, defaults to current data without iteration.

					if (range) {
						range = props.reverse ? "unshift" : "push";
						end = +props.end;
						step = +props.step || 1;
						value = []; // auto-create integer array scenario of {{for start=xxx end=yyy}}
						for (i = +props.start || 0; (end - i) * step > 0; i += step) {
							value[range](i);
						}
					}
					if (value !== undefined) {
						isArray = $isArray(value);
						result += tagCtx.render(value, !iterate || props.noIteration);
						// Iterates if data is an array, except on final else - or if noIteration property
						// set to true. (Use {{include}} to compose templates without array iteration)
						done += isArray ? value.length : 1;
					}
					if (self.rendering.done = done) {
						self.selected = tagCtx.index;
					}
					// If nothing was rendered we will look at the next {{else}}. Otherwise, we are done.
				}
				return result;
			},
			setDataMap: function(tagCtxs) {
				var tagCtx, props, paramsProps,
					self = this,
					l = tagCtxs.length;
				while (l--) {
					tagCtx = tagCtxs[l];
					props = tagCtx.props;
					paramsProps = tagCtx.params.props;
					tagCtx.argDefault = props.end === undefined || tagCtx.args.length > 0; // Default to #data except for auto-create range scenario {{for start=xxx end=yyy step=zzz}}
					props.dataMap = (tagCtx.argDefault !== false && $isArray(tagCtx.args[0]) &&
						(paramsProps.sort || paramsProps.start || paramsProps.end || paramsProps.step || paramsProps.filter || paramsProps.reverse
						|| props.sort || props.start || props.end || props.step || props.filter || props.reverse))
						&& self.sortDataMap;
				}
			},
			flow: true
		},
		props: {
			baseTag: "for",
			dataMap: dataMap(getTargetProps),
			init: noop, // Don't execute the base init() of the "for" tag
			flow: true
		},
		include: {
			flow: true
		},
		"*": {
			// {{* code... }} - Ignored if template.allowCode and $.views.settings.allowCode are false. Otherwise include code in compiled template
			render: retVal,
			flow: true
		},
		":*": {
			// {{:* returnedExpression }} - Ignored if template.allowCode and $.views.settings.allowCode are false. Otherwise include code in compiled template
			render: retVal,
			flow: true
		},
		dbg: $helpers.dbg = $converters.dbg = dbgBreak // Register {{dbg/}}, {{dbg:...}} and ~dbg() to throw and catch, as breakpoints for debugging.
	});

	$converters({
		html: htmlEncode,
		attr: htmlEncode, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
		encode: dataEncode,
		unencode: dataUnencode, // Includes > encoding since rConvertMarkers in JsViews does not skip > characters in attribute strings
		url: function(text) {
			// URL encoding helper.
			return text != undefined ? encodeURI("" + text) : text === null ? text : ""; // null returns null, e.g. to remove attribute. undefined returns ""
		}
	});
}
//========================== Define default delimiters ==========================
$subSettings = $sub.settings;
$isArray = ($||jsr).isArray;
$viewsSettings.delimiters("{{", "}}", "^");

if (jsrToJq) { // Moving from jsrender namespace to jQuery namepace - copy over the stored items (templates, converters, helpers...)
	jsr.views.sub._jq($);
}
return $ || jsr;
}, window));


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var __webpack_exports__ = {};
/*!**************************************!*\
  !*** ./resources/assets/js/turbo.js ***!
  \**************************************/
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @hotwired/turbo */ "./node_modules/@hotwired/turbo/dist/turbo.es2017-esm.js");



window.Turbo = _hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__;
_hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__.start();
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_hotwired_turbo__WEBPACK_IMPORTED_MODULE_0__);
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************!*\
  !*** ./resources/assets/js/custom/helpers.js ***!
  \***********************************************/


window.isEmpty = function (value) {
  return value === undefined || value === null || value === '';
};
window.randomCode = function () {
  var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 6;
  return Math.random().toString(36).slice(-length);
};
window.listen = function (event, selector, callback) {
  $(document).on(event, selector, callback);
};
window.listenClick = function (selector, callback) {
  $(document).on('click', selector, callback);
};
window.listenSubmit = function (selector, callback) {
  $(document).on('submit', selector, callback);
};
window.listenHiddenBsModal = function (selector, callback) {
  $(document).on('hidden.bs.modal', selector, callback);
};
window.listenChange = function (selector, callback) {
  $(document).on('change', selector, callback);
};
window.listenKeyup = function (selector, callback) {
  $(document).on('keyup', selector, callback);
};
window.listenShownBsModal = function (selector, callback) {
  $(document).on('shown.bs.modal', selector, callback);
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./resources/assets/js/custom/custom.js ***!
  \**********************************************/


var jsrender = __webpack_require__(/*! jsrender */ "./node_modules/jsrender/jsrender.js");
var csrfToken = $('meta[name="csrf-token"]').attr('content');
$.ajaxSetup({
  headers: {
    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
  }
});
document.addEventListener('turbo:load', initAllComponents);
function initAllComponents() {
  select2initialize();
  refreshCsrfToken();
  alertInitialize();
  modalInputFocus();
  inputFocus();
  IOInitImageComponent();
  IOInitSidebar();
  bootstrapTooltip();
  checkPriceField();
}
var firstTime = true;
function bootstrapTooltip() {
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
}
function select2initialize() {
  $('[data-control="select2"]').each(function () {
    $(this).select2();
  });
}
function refreshCsrfToken() {
  csrfToken = $('meta[name="csrf-token"]').attr('content');
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': csrfToken
    }
  });
}
function alertInitialize() {
  $('.alert').delay(5000).slideUp(300);
}
var modalInputFocus = function modalInputFocus() {
  $(function () {
    $('.modal').on('shown.bs.modal', function () {
      $(this).find('input:text').first().focus();
    });
  });
};
var inputFocus = function inputFocus() {
  $('input:text:not([readonly="readonly"]):not([name="search"]):not(.front-input)').first().focus();
};
$(document).on('keydown', function (e) {
  if (e.keyCode === 27) {
    $('.modal').modal('hide');
  }
});
$('input:text:not([readonly="readonly"])').first().focus();
$(document).on('select2:open', function () {
  var allFound = document.querySelectorAll('.select2-container--open .select2-search__field');
  allFound[allFound.length - 1].focus();
});
$('[data-control="select2"]').each(function () {
  $(this).select2();
});
document.addEventListener('livewire:load', function () {
  window.livewire.hook('message.processed', function () {
    $('[data-control="select2"]').each(function () {
      $(this).select2();
    });
  });
});
$(document).ready(function () {
  // initializer script for bootstrap 4 tooltip
  $('[data-bs-toggle="tooltip"]').tooltip();
  function tooltip() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  // script to active parent menu if sub menu has currently active
  var hasActiveMenu = $(document).find('.nav-item.nav-dropdown ul li.nav-item').hasClass('active');
  if (hasActiveMenu) $(document).find('.nav-item.nav-dropdown ul li.nav-item.active').parent('ul').parent('li').addClass('open');
  listenClick('.nav-item.nav-dropdown', function () {
    var openLiSelector = $(document).find('.nav-item.nav-dropdown').hasClass('open');
    if (openLiSelector && $(this).hasClass('open')) setTimeout(function () {
      $(this).removeClass('open');
    }, 1000);else $(document).find('.nav-item.nav-dropdown').removeClass('open');
  });

  // remove capital letters from email validation script.
  listenKeyup('input[name="email"]', function () {
    this.value = this.value.toLowerCase();
  });
  $('input[name="email"]').keypress(function (e) {
    if (e.which === 32) return false;
  });
});
$(function () {
  listenShownBsModal('.modal', function () {
    $(this).find('input:text').first().focus();
  });
  listenHiddenBsModal('.modal', function () {
    $('.image-input.image-input-empty').attr('style', 'display:inline-block');
  });
});
window.resetModalForm = function (formId, validationBox) {
  var inputs = $(formId)[0].elements;
  $.each(inputs, function (index, value) {
    if (typeof value._flatpickr !== 'undefined') {
      value._flatpickr.clear();
      value._flatpickr.setDate(new Date());
    }
  });
  $(formId)[0].reset();
  $('select.select2Selector').each(function (index, element) {
    var drpSelector = '#' + $(this).attr('id');
    $(drpSelector).val('');
    $(drpSelector).trigger('change');
  });
  $(validationBox).hide();
};
window.processingBtn = function (selecter, btnId) {
  var state = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
  var loadingButton = $(selecter).find(btnId);
  if (state === 'loading') {
    loadingButton.button('loading');
  } else {
    loadingButton.button('reset');
  }
};
window.printErrorMessage = function (selector, errorResult) {
  // $(selector).show().html("");
  // $(selector).text(errorResult.responseJSON.message);
  displayErrorMessage(errorResult.responseJSON.message);
};
toastr.options = {
  'closeButton': true,
  'debug': false,
  'newestOnTop': false,
  'progressBar': true,
  'positionClass': 'toast-top-right',
  'preventDuplicates': false,
  'onclick': null,
  'showDuration': '300',
  'hideDuration': '1000',
  'timeOut': '5000',
  'extendedTimeOut': '1000',
  "showEasing": "swing",
  "hideEasing": "linear",
  "showMethod": "fadeIn",
  "hideMethod": "fadeOut"
};
window.manageAjaxErrors = function (data) {
  var errorDivId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'editValidationErrorsBox';
  if (data.status == 404) {
    toastr.error(data.responseJSON.message);
  } else {
    printErrorMessage("#" + errorDivId, data);
  }
};
window.displaySuccessMessage = function (message) {
  toastr.success(message);
};
window.displayErrorMessage = function (message) {
  toastr.error(message);
};
window.displayPhoto = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
window.isValidFile = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html('The image must be a file of type: jpeg, jpg, png.').removeClass('d-none').show();
    setTimeout(function () {
      $(validationMessageSelector).slideUp(300);
    }, 5000);
    return false;
  }
  $(validationMessageSelector).addClass('d-none');
  return true;
};
window.format = function (dateTime) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'YYYY-MM-DD';
  return moment(dateTime).format(format);
};
window.DatetimepickerDefaults = function (opts) {
  return $.extend({}, {
    sideBySide: true,
    ignoreReadonly: true,
    icons: {
      up: "icon-arrow-up-circle icons font-2xl",
      down: "icon-arrow-down-circle icons font-2xl",
      previous: 'icon-arrow-left icons',
      next: 'icon-arrow-right icons',
      time: 'fa fa-clock-o',
      date: 'fa fa-calendar',
      today: 'fa fa-crosshairs',
      clear: 'fa fa-trash',
      close: 'fa fa-times'
    }
  }, opts);
};
window.screenLock = function () {
  $('#overlay-screen-lock').show();
  $('body').css({
    'pointer-events': 'none',
    'opacity': '0.6'
  });
};
window.screenUnLock = function () {
  $('body').css({
    'pointer-events': 'auto',
    'opacity': '1'
  });
  $('#overlay-screen-lock').hide();
};
window.prepareTemplateRender = function (templateSelector, data) {
  var template = jsrender.templates(templateSelector);
  return template.render(data);
};

/**
 * @return string
 */
window.getCurrentCurrencyClass = function () {
  return '<b>' + $('.currentCurrency').val() + '</b>';
};
window.hideDropdownManually = function (dropdownBtnEle, dropdownEle) {
  dropdownBtnEle.removeClass('show');
  dropdownEle.removeClass('show');
};
window.displayDocument = function (input, selector, extension) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      if ($.inArray(extension, ['pdf', 'doc', 'docx', 'mp3', 'mp4']) == -1) {
        image.src = e.target.result;
      } else {
        if (extension == 'pdf') {
          $('#editPhoto').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
          image.src = $('.pdfDocumentImageUrl').val();
        } else if (extension == 'mp3') {
          image.src = $('.audioDocumentImageUrl').val();
        } else if (extension == 'mp4') {
          image.src = $('.videoDocumentImageUrl').val();
        } else {
          image.src = $('.docxDocumentImageUrl').val();
        }
      }
      image.onload = function () {
        $(selector).attr('src', image.src);
        $(selector).css('background-image', 'url("' + image.src + '")');
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
var ajaxCallIsRunning = $('.ajaxCallIsRunning').val();
window.ajaxCallInProgress = function () {
  ajaxCallIsRunning = true;
};
window.ajaxCallCompleted = function () {
  ajaxCallIsRunning = false;
};
window.UnprocessableInputError = function (data) {
  toastr.error(data.responseJSON.message);
};

// set N/A if span tag is empty
window.setValueOfEmptySpan = function () {
  $('span.showSpan').each(function () {
    if (!$(this).text()) {
      $(this).text('N/A');
    }
  });
};

// Add comma into numbers
window.addCommas = function (number) {
  number += '';
  var x = number.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};
$(function () {
  listenClick('.notification', function (e) {
    e.stopPropagation();
    var notificationId = $(this).data('id');
    var notification = $(this);
    $('[data-toggle="tooltip"]').tooltip('hide');
    $.ajax({
      type: 'get',
      url: '/notification/' + notificationId + '/read',
      success: function success() {
        notification.remove();
        displaySuccessMessage(Lang.get('messages.flash.notification_read'));
        var notificationCounter = document.getElementsByClassName('notification').length;
        $('#counter').text(notificationCounter);
        if (notificationCounter == 0) {
          $('.read-all-notification').addClass('d-none');
          $('.empty-state').removeClass('d-none');
          $('#counter').text(notificationCounter);
          $('.notification-count').addClass('d-none');
        }
      },
      error: function error(result) {
        manageAjaxErrors(result);
      }
    });
  });
  listenClick('#readAllNotification', function (e) {
    e.stopPropagation();
    $.ajax({
      type: 'post',
      url: '/read-all-notification',
      success: function success() {
        $('.notification').remove();
        displaySuccessMessage(Lang.get('messages.flash.all_notification_read'));
        var notificationCounter = document.getElementsByClassName('notification').length;
        $('#counter').text(notificationCounter);
        $('#readAllNotification').addClass('d-none');
        $('.empty-state').addClass('d-none');
        $('.empty-state.empty-notification').removeClass('d-none');
        $('.notification-count').addClass('d-none');
        displaySuccessMessage(Lang.get('messages.flash.all_notification_read'));
      },
      error: function error(result) {
        manageAjaxErrors(result);
      }
    });
  });
});
window.avoidSpace = function (event) {
  var k = event ? event.which : window.event.keyCode;
  if (k == 32 && event.path[0].value.length <= 0) {
    return false;
  }
};
var defaultAvatarImageUrl = 'asset(\'assets/img/avatar.png\')';
window.defaultImagePreview = function (imagePreviewSelector) {
  var id = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (id == 1) {
    $(imagePreviewSelector).css('background-image', 'url("' + defaultAvatarImageUrl + '")');
  } else {
    $(imagePreviewSelector).css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
  }
};
listenClick('.assign-workspace', function (e) {
  e.stopPropagation();
  $.ajax({
    type: 'post',
    url: '/assign-workspace',
    data: {
      'tenant_id': '81becc9c-c7ea-4748-b894-71ddd855fdf2'
    },
    success: function success() {},
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
function checkPriceField() {
  listen('keypress', '.price-format', function () {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57) && event.which != 0 && event.which != 8) {
      event.preventDefault();
    }
    var text = $(this).val();
    if (text.indexOf('.') != -1 && text.substring(text.indexOf('.')).length > 2 && event.which != 0 && event.which != 8 && $(this)[0].selectionStart >= text.length - 2) {
      event.preventDefault();
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************************************************!*\
  !*** ./resources/assets/js/custom/phone-number-country-code.js ***!
  \*****************************************************************/


document.addEventListener('turbo:load', loadPhoneNumberCountryCodeData);
function loadPhoneNumberCountryCodeData() {
  if (!$('#phoneNumber').length) {
    return false;
  }
  // $('#phoneNumber').attr('placeholder',Lang.get('messages.sms.phone_number'));

  Lang.setLocale($('.userCurrentLanguage').val());
  var input = document.querySelector('#phoneNumber'),
    errorMsg = document.querySelector('#error-msg'),
    validMsg = document.querySelector('#valid-msg');
  var errorMap = [Lang.get('messages.common.invalid_number'), Lang.get('messages.common.invalid_country_code'), Lang.get('messages.common.too_short'), Lang.get('messages.common.too_long'), Lang.get('messages.common.invalid_number')];

  // initialise plugin
  if ($(".isEdit").val()) {
    var countryValue = $(".country_iso").val();
  } else {
    var countryValue = defaultCountryCodeValue;
  }
  var intl = window.intlTelInput(input, {
    initialCountry: defaultCountryCodeValue,
    separateDialCode: true,
    geoIpLookup: function geoIpLookup(success, failure) {
      $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
        var countryCode = resp && resp.country ? resp.country : '';
        success(countryCode);
      });
    },
    utilsScript: $('.utilsScript').val()
  });
  var reset = function reset() {
    input.classList.remove('error');
    errorMsg.innerHTML = '';
    errorMsg.classList.add('d-none');
    validMsg.classList.add('d-none');
    // validMsg.classList.add('d-none')
  };
  input.addEventListener('blur', function () {
    reset();
    if (input.value.trim()) {
      if (intl.isValidNumber()) {
        validMsg.classList.remove('d-none');
      } else {
        input.classList.add('error');
        var errorCode = intl.getValidationError();
        errorMsg.innerHTML = errorMap[errorCode];
        errorMsg.classList.remove('d-none');
      }
    }
  });

  // on keyup / change flag: reset
  input.addEventListener('change', reset);
  input.addEventListener('keyup', reset);
  var phoneNo = $('.phoneNo').val();
  if (typeof phoneNo != 'undefined' && phoneNo !== '') {
    setTimeout(function () {
      $('#phoneNumber').trigger('change');
    }, 500);
  }
  listen('blur keyup change countrychange', function () {
    if (typeof phoneNo != 'undefined' && phoneNo !== '') {
      intl.setNumber('+' + phoneNo);
      phoneNo = '';
    }
    var getCode = intl.selectedCountryData['dialCode'];
    $('.prefix_code').val(getCode);
  });
  if ($('.isEdit').val()) {
    var getCode = intl.selectedCountryData['dialCode'];
    var country_iso = intl.selectedCountryData["iso2"];
    $('.prefix_code').val(getCode);
    $(".country_iso").val(country_iso);
  }
  $('#phoneNumber').focus();
  $('#phoneNumber').blur();
  var getPhoneNumber = $('#phoneNumber').val();
  var removeSpacePhoneNumber = getPhoneNumber.replace(/\s/g, '');
  $('#phoneNumber').val(removeSpacePhoneNumber);
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************************!*\
  !*** ./resources/assets/js/custom/new-edit-modal-form.js ***!
  \***********************************************************/


window.newRecord = function (data, loadingButton) {
  var modalSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#AddModal';
  var formData = data.formSelector === '' ? data.formData : new FormData($(data.formSelector)[0]);
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: data.url,
    type: data.type,
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        $(loadingButton).attr('disabled', false);
        displaySuccessMessage(result.message);
        $(modalSelector).modal('hide');
        // $(data.tableSelector).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      $(loadingButton).attr('disabled', false);
      printErrorMessage('#validationErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
};
window.editRecord = function (data, loadingButton, modalSelector) {
  var btnToDisabledSelector = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';
  $(loadingButton).attr('disabled', true);
  var formData = data.formSelector === '' ? data.formData : new FormData($(data.formSelector)[0]);
  $.ajax({
    url: data.url,
    type: data.type,
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        $(loadingButton).attr('disabled', false);
        displaySuccessMessage(result.message);
        $(modalSelector).modal('hide');
        // $(data.tableSelector).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      $(loadingButton).attr('disabled', false);
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
      $(btnToDisabledSelector).attr('disabled', true);
    }
  });
};
window.editRecordWithForm = function (data, loadingButton, modalSelector) {
  var formData = data.formSelector === '' ? data.formData : $(data.formSelector).serialize();
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: data.url,
    type: data.type,
    data: formData,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $(modalSelector).modal('hide');
        // $(data.tableSelector).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./resources/assets/js/custom/delete.js ***!
  \**********************************************/


window.deleteItem = function (url) {
  var tableId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var header = arguments.length > 2 ? arguments[2] : undefined;
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  swal({
    title: $('.deleteVariable').val() + '!',
    text: $('.confirmVariable').val() + header + '?',
    icon: sweetAlertIcon,
    buttons: {
      confirm: $('.yesVariable').val() + ',' + $('.deleteVariable').val(),
      cancel: $('.noVariable').val() + ',' + $('.cancelVariable').val()
    }
  }).then(function (result) {
    if (result) {
      // Livewire.emit('resetPage')
      deleteItemAjax(url, tableId = null, header, callFunction = null);
    }
  });
};
function deleteItemAjax(url) {
  var tableId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var header = arguments.length > 2 ? arguments[2] : undefined;
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  $.ajax({
    url: url,
    type: 'DELETE',
    dataType: 'json',
    success: function success(obj) {
      if (obj.success) {
        Livewire.emit('resetPage');
      }
      swal({
        icon: 'success',
        title: $('.deletedVariable').val(),
        confirmButtonColor: '#f62947',
        text: header + ' ' + $('.hasBeenDeletedVariable').val(),
        timer: 2000,
        buttons: {
          confirm: $('.okVariable').val()
        }
      });
      if (callFunction) {
        eval(callFunction);
      }
    },
    error: function error(data) {
      swal({
        title: '',
        text: data.responseJSON.message,
        confirmButtonColor: '#009ef7',
        icon: 'error',
        timer: 5000,
        buttons: {
          confirm: $('.okVariable').val()
        }
      });
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************!*\
  !*** ./resources/assets/js/custom/reset_models.js ***!
  \****************************************************/


$('#AddModal').on('hidden.bs.modal', function () {
  $('.preview-image').prop('src', defaultImageUrl);
  $('.select2-dd').val('').trigger('change.select2');
  resetModalForm('#addNewForm', '#validationErrorsBox');
});
$('#EditModal').on('hidden.bs.modal', function () {
  $('.preview-image').prop('src', defaultImageUrl);
  $('.select2-dd').val('').trigger('change.select2');
  resetModalForm('#editForm', '#editValidationErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************!*\
  !*** ./resources/assets/js/custom/add-edit-profile-picture.js ***!
  \****************************************************************/


listenChange('#profileImage', function () {
  var extension = isValidDocument($(this), '#customValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#customValidationErrorsBox').html('').hide();
    displayPhoto(this, '#previewImage');
  }
});
window.isValidDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html('The profile image must be a file of type: jpeg, jpg, png, gif.').removeClass('d-none').show();
    setTimeout(function () {
      $(validationMessageSelector).slideUp(300);
    }, 5000);
    return false;
  }
  $(validationMessageSelector).addClass('d-none');
  return ext;
};
window.displayPhoto = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/appointments/appointments.js ***!
  \**********************************************************/


function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
document.addEventListener('turbo:load', loadAppointmentTable);
function loadAppointmentTable() {
  // console.log(Lang.get('messages.appointment.yesterday'));
  //
  // return false

  var appointmentTimeRange = $('#time_range');
  var appointmentStart = moment().startOf('week');
  var appointmentEnd = moment().endOf('week');
  var appointmentStartTime = '';
  var appointmentEndTime = '';
  if ($('#appointmentStatus').length) {
    $('#appointmentStatus').select2();
  }
  function cb(appointmentStart, appointmentEnd) {
    $('#time_range').html(appointmentStart.format('MMM D, YYYY') + ' - ' + appointmentEnd.format('MMM D, YYYY'));
  }
  if (appointmentTimeRange.length) {
    Lang.setLocale($('.userCurrentLanguage').val());
    appointmentTimeRange.daterangepicker({
      startDate: appointmentStart,
      endDate: appointmentEnd,
      locale: {
        customRangeLabel: Lang.get('messages.common.custom'),
        applyLabel: Lang.get('messages.common.apply'),
        cancelLabel: Lang.get('messages.common.cancel'),
        fromLabel: Lang.get('messages.common.from'),
        toLabel: Lang.get('messages.common.to'),
        monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
        daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
      },
      ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.appointment.today'), [moment(), moment()]), Lang.get('messages.appointment.yesterday'), [moment().subtract(1, 'days'), moment().subtract(1, 'days')]), Lang.get('messages.appointment.this_week'), [moment().startOf('week'), moment().endOf('week')]), Lang.get('messages.appointment.last_7_days'), [moment().subtract(6, 'days'), moment()]), Lang.get('messages.appointment.last_30_days'), [moment().subtract(29, 'days'), moment()]), Lang.get('messages.appointment.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.appointment.last_month'), [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')])
    }, cb);
    cb(appointmentStart, appointmentEnd);
    appointmentTimeRange.on('apply.daterangepicker', function (ev, picker) {
      appointmentStartTime = picker.startDate.format('YYYY-MM-D  H:mm:ss');
      appointmentEndTime = picker.endDate.format('YYYY-MM-D  H:mm:ss');
      window.livewire.emit('changeDateFilter', 'statusFilter', [appointmentStartTime, appointmentEndTime]);
    });
  }
  listenClick('.appointment-delete-btn', function (event) {
    var appointmentId = $(event.currentTarget).attr('data-id');
    deleteItem($('.appointmentURL').val() + '/' + appointmentId, '#appointmentsTbl', $('#appointmentLang').val());
  });
  listenChange('#appointmentStatus', function () {
    var status = $(this).val();
    window.livewire.emit('changeFilter', 'statusFilter', [appointmentStartTime, appointmentEndTime, status]);
  });
  listenClick('#appointmentResetFilter', function () {
    var appointmentTimeRange = $('#time_range');
    appointmentStartTime = appointmentTimeRange.data('daterangepicker').setStartDate(moment().startOf('week').format('MM/DD/YYYY'));
    appointmentEndTime = appointmentTimeRange.data('daterangepicker').setEndDate(moment().endOf('week').format('MM/DD/YYYY'));
    $('#appointmentStatus').val(2).trigger('change');
    hideDropdownManually($('#appointmentFilterBtn'), $('.dropdown-menu'));
  });
  listenClick('.appointment-complete-status', function (event) {
    var appointmentId = $(event.currentTarget).attr('data-id');
    completeAppointment($('.appointmentURL').val() + '/' + appointmentId + '/status', '#appointmentsTbl', Lang.get('messages.web_menu.appointment') + ' ' + Lang.get('messages.user.status'));
  });
  listenClick('.cancel-appointment', function () {
    var appointmentId = $(this).attr('data-id');
    cancelAppointment($('.appointmentURL').val() + '/' + appointmentId + '/cancel', '#appointmentsTbl', Lang.get('messages.web_menu.appointment'));
  });
  window.cancelAppointment = function (url, tableId, header, appointmentId) {
    swal({
      title: Lang.get('messages.common.cancel') + ' ' + Lang.get('messages.web_menu.appointment'),
      text: Lang.get('messages.appointment.are_you_sure_want_to_cancel') + ' ' + header + ' ?',
      type: 'warning',
      icon: 'warning',
      closeOnConfirm: false,
      confirmButtonColor: '#000000',
      showLoaderOnConfirm: true,
      buttons: {
        confirm: $('.yesVariable').val(),
        cancel: $('.noVariable').val()
      }
    }).then(function (result) {
      if (result) {
        cancelAppointmentAjax(url, tableId, header, appointmentId);
      }
    });
  };
  function cancelAppointmentAjax(url, tableId, header, appointmentId) {
    $.ajax({
      url: url,
      type: 'POST',
      success: function success(obj) {
        if (obj.success) {
          // Livewire.emit('refresh')
          if ($(tableId).DataTable().data().count() == 1) {
            $(tableId).DataTable().page('previous').draw('page');
          } else {
            // $(tableId).DataTable().ajax.reload(null, false)
            window.livewire.emit('refresh');
          }
        }
        swal({
          title: Lang.get('messages.common.canceled') + ' ' + Lang.get('messages.web_menu.appointment') + ' ' + '!',
          text: Lang.get('messages.flash.appointment_cancel'),
          icon: 'success',
          confirmButtonColor: '#D9214E',
          timer: 2000,
          buttons: {
            confirm: $('.okVariable').val()
          }
        });
      },
      error: function error(data) {
        swal({
          title: 'Error',
          icon: 'error',
          text: data.responseJSON.message,
          type: 'error',
          confirmButtonColor: '#D9214E',
          timer: 5000,
          buttons: {
            confirm: $('.okVariable').val()
          }
        });
      }
    });
  }
  function completeAppointment(url, tableId, header, appointmentId) {
    swal({
      title: Lang.get('messages.appointment.change_status'),
      text: Lang.get('messages.appointment.are_you_sure_want_to_change') + '?',
      type: 'warning',
      icon: 'warning',
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonColor: '#50cd89',
      showLoaderOnConfirm: true,
      buttons: {
        confirm: $('.yesVariable').val(),
        cancel: $('.noVariable').val()
      }
    }).then(function (result) {
      if (result) {
        completeAppointmentAjax(url, tableId, header, appointmentId);
      }
    });
  }
  function completeAppointmentAjax(url, tableId, header, appointmentId) {
    $.ajax({
      url: url,
      type: 'POST',
      success: function success(obj) {
        if (obj.success) {
          if ($(tableId).DataTable().data().count() == 1) {
            $(tableId).DataTable().page('previous').draw('page');
          } else {
            window.livewire.emit('refresh');
            // $(tableId).DataTable().ajax.reload(null, false)
          }
          Livewire.emit('refresh');
        }
        swal({
          title: Lang.get('messages.appointment.changed_appointment'),
          text: header + ' ' + Lang.get('messages.appointment.has_been_changed'),
          icon: 'success',
          confirmButtonColor: '#50cd89',
          timer: 2000,
          buttons: {
            confirm: $('.okVariable').val()
          }
        });
      },
      error: function error(data) {
        swal({
          title: 'Error',
          icon: 'error',
          text: data.responseJSON.message,
          type: 'error',
          confirmButtonColor: '#50cd89',
          timer: 5000,
          buttons: {
            confirm: $('.okVariable').val()
          }
        });
      }
    });
  }
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*********************************************************!*\
  !*** ./resources/assets/js/appointments/create-edit.js ***!
  \*********************************************************/


document.addEventListener('turbo:load', loadAppointmentCreateEdit);
function loadAppointmentCreateEdit() {
  if ($('#appointmentForm').length || $('#editAppointmentForm').length) {
    //parseIn date_time
    var appointmentParseIn = function appointmentParseIn(date_time) {
      var d = new Date();
      d.setHours(date_time.substring(11, 13));
      d.setMinutes(date_time.substring(14, 16));
      return d;
    }; //make time slot list
    var appointmentGetTimeIntervals = function appointmentGetTimeIntervals(time1, time2, duration) {
      var arr = [];
      while (time1 < time2) {
        arr.push(time1.toTimeString().substring(0, 5));
        time1.setMinutes(time1.getMinutes() + duration);
      }
      return arr;
    };
    var appointmentPatientIdElement = $('#appointmentsPatientId');
    var appointmentDoctorIdElement = $('#appointmentDoctorId');
    var appointmentDepartmentIdElement = $('#appointmentDepartmentId');
    if (appointmentPatientIdElement.length) {
      $('#appointmentsPatientId').select2({
        width: '100%'
      });
      $('#appointmentsPatientId').first().focus();
    }
    if (appointmentDoctorIdElement.length) {
      $('#appointmentDoctorId').select2({
        width: '100%'
      });
    }
    if (appointmentDepartmentIdElement.length) {
      $('#appointmentDepartmentId').select2({
        width: '100%'
      });
    }
    var appointmentSelectedDate;
    var appointmentIntervals;
    var appointmentAlreadyCreateTimeSlot;
    var appointmentBreakIntervals;
    var opdDate = $('.opdDate').flatpickr({
      enableTime: false,
      // minDate: moment().subtract(1, 'days').format(),
      minDate: moment(new Date()).format('YYYY-MM-DD'),
      dateFormat: 'Y-m-d',
      locale: $('.userCurrentLanguage').val(),
      onChange: function onChange(selectedDates, dateStr, instance) {
        if (!isEmpty(dateStr)) {
          $('.doctor-schedule').css('display', 'none');
          $('.error-message').css('display', 'none');
          $('.available-slot-heading').css('display', 'none');
          $('.color-information').css('display', 'none');
          $('.available-slot').css('display', 'none');
          $('.time-slot').remove();
          if ($('#appointmentDepartmentId').val() == '') {
            $('#createAppointmentErrorsBox').show().html(Lang.get('messages.appointment.please_select_doctor') + ' ' + Lang.get('messages.department'));
            $('#createAppointmentErrorsBox').delay(5000).fadeOut();
            $('.opdDate').val('');
            opdDate.clear();
            return false;
          } else if ($('#appointmentDoctorId').val() == '') {
            $('#createAppointmentErrorsBox').show().html(Lang.get('messages.appointment.please_select_doctor'));
            $('#createAppointmentErrorsBox').delay(5000).fadeOut();
            $('.opdDate').val('');
            opdDate.clear();
            return false;
          }
          var weekday = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          var selected = new Date(dateStr);
          var dayName = weekday[selected.getDay()];
          appointmentSelectedDate = dateStr;
          //if dayName is blank, then ajax call not run.
          if (dayName == null || dayName == '') {
            return false;
          }

          //get doctor schedule list with time slot.
          $.ajax({
            type: 'GET',
            url: $('.doctorScheduleList').val(),
            data: {
              day_name: dayName,
              doctor_id: appointmentDoctorId,
              date: appointmentSelectedDate
            },
            success: function success(result) {
              if (result.success) {
                if (result.data != '') {
                  if (result.data.scheduleDay.length != 0 && result.data.doctorHoliday.length == 0) {
                    var availableFrom = '';
                    if (moment(new Date()).format('YYYY-MM-DD') === dateStr) {
                      availableFrom = moment().ceil(moment.duration(result.data.perPatientTime[0].per_patient_time).asMinutes(), 'minute');
                      availableFrom = moment(availableFrom.toString()).format('H:mm:ss');
                      // availableFrom = moment(new Date()).
                      //     add(result.data.perPatientTime[0].per_patient_time,
                      //         'minutes').
                      //     format('H:mm:ss');
                    } else {
                      availableFrom = result.data.scheduleDay[0].available_from;
                    }
                    var doctorStartTime = appointmentSelectedDate + ' ' + availableFrom;
                    var doctorEndTime = appointmentSelectedDate + ' ' + result.data.scheduleDay[0].available_to;
                    var doctorPatientTime = result.data.perPatientTime[0].per_patient_time;
                    //perPatientTime convert to Minute
                    var a = doctorPatientTime.split(':'); // split it at the colons
                    var minutes = +a[0] * 60 + +a[1]; // convert to minute
                    //parse In

                    var startTime = appointmentParseIn(doctorStartTime);
                    var endTime = appointmentParseIn(doctorEndTime);
                    //call to getTimeIntervals function
                    appointmentIntervals = appointmentGetTimeIntervals(startTime, endTime, minutes);
                    if (result.data.doctorBreak != null) {
                      for (var breakIndex = 0; breakIndex < result.data.doctorBreak.length; ++breakIndex) {
                        var startBreakTime = appointmentParseIn(appointmentSelectedDate + ' ' + result.data.doctorBreak[breakIndex].break_from);
                        var endBreakTime = appointmentParseIn(appointmentSelectedDate + ' ' + result.data.doctorBreak[breakIndex].break_to);
                        appointmentBreakIntervals = appointmentGetTimeIntervals(startBreakTime, endBreakTime, 1);
                        appointmentIntervals = appointmentIntervals.filter(function (slot) {
                          return !appointmentBreakIntervals.includes(slot);
                        });
                      }
                    }

                    //if intervals array length is grater then 0 then process
                    if (appointmentIntervals.length > 0) {
                      $('.available-slot-heading').css('display', 'block');
                      $('.color-information').css('display', 'block');
                      $('.available-slot').css('display', 'block');
                      var index;
                      var timeStlots = '';
                      for (index = 0; index < appointmentIntervals.length; ++index) {
                        var data = [{
                          'index': index,
                          'timeSlot': appointmentIntervals[index]
                        }];
                        var timeSlot = prepareTemplateRender('#appointmentSlotTemplate', data);
                        timeStlots += timeSlot;
                      }
                      $('.available-slot').append(timeStlots);
                    }

                    // display Day Name and time
                    if (availableFrom != '00:00:00' && result.data.scheduleDay[0].available_to != '00:00:00' && doctorStartTime != doctorEndTime) {
                      $('.doctor-schedule').css('display', 'block');
                      $('.color-information').css('display', 'block');
                      $('.available-slot').css('display', 'block');
                      $('.day-name').html(result.data.scheduleDay[0].available_on);
                      $('.schedule-time').html('[' + availableFrom + ' - ' + result.data.scheduleDay[0].available_to + ']');
                    } else {
                      $('.doctor-schedule').css('display', 'none');
                      $('.color-information').css('display', 'none');
                      $('.available-slot').css('display', 'none');
                      $('.error-message').css('display', 'block');
                      $('.error-message').html(Lang.get('messages.appointment.doctor_schedule_not_available_on_this_date'));
                    }
                  } else {
                    $('.doctor-schedule').css('display', 'none');
                    $('.color-information').css('display', 'none');
                    $('.available-slot').css('display', 'none');
                    $('.error-message').css('display', 'block');
                    $('.error-message').html(Lang.get('messages.appointment.doctor_schedule_not_available_on_this_date'));
                  }
                }
              }
            },
            error: function error(_error) {
              displayErrorMessage(_error.responseJSON.message);
            }
          });
          if ($('.isCreate').val() || $('.isEdit').val()) {
            var getCreateTimeSlot = function getCreateTimeSlot() {
              if ($('.isCreate').val()) {
                var data = {
                  editSelectedDate: appointmentSelectedDate,
                  doctor_id: appointmentDoctorId
                };
              } else {
                var data = {
                  editSelectedDate: appointmentSelectedDate,
                  editId: $('#appointmentEditsID').val(),
                  doctor_id: appointmentDoctorId
                };
              }
              $.ajax({
                url: $('.getBookingSlot').val(),
                type: 'GET',
                data: data,
                success: function success(result) {
                  appointmentAlreadyCreateTimeSlot = result.data.bookingSlotArr;
                  if (result.data.hasOwnProperty('onlyTime')) {
                    if (result.data.bookingSlotArr.length > 0) {
                      appointmentEditTimeSlot = result.data.onlyTime.toString();
                      $.each(result.data.bookingSlotArr, function (index, value) {
                        $.each(appointmentIntervals, function (i, v) {
                          if (value == v) {
                            $('.time-interval').each(function () {
                              if ($(this).data('id') == i) {
                                if ($(this).html() != appointmentEditTimeSlot) {
                                  $(this).parent().css({
                                    'background-color': '#ffa721',
                                    'border': '1px solid #ffa721',
                                    'color': '#ffffff'
                                  });
                                  $(this).parent().addClass('booked');
                                  $(this).parent().children().prop('disabled', true);
                                }
                              }
                            });
                          }
                        });
                      });
                    }
                    $('.time-interval').each(function () {
                      if ($(this).html() == appointmentEditTimeSlot && result.data.bookingSlotArr.length > 0) {
                        $(this).parent().addClass('time-slot-book');
                        $(this).parent().removeClass('booked');
                        $(this).parent().children().prop('disabled', false);
                        $(this).click();
                      }
                    });
                  } else if (appointmentAlreadyCreateTimeSlot.length > 0) {
                    $.each(appointmentAlreadyCreateTimeSlot, function (index, value) {
                      $.each(appointmentIntervals, function (i, v) {
                        if (value == v) {
                          $('.time-interval').each(function () {
                            if ($(this).data('id') == i) {
                              $(this).parent().addClass('time-slot-book');
                              $('.time-slot-book').css({
                                'background-color': '#ffa721',
                                'border': '1px solid #ffa721',
                                'color': '#ffffff'
                              });
                              $(this).parent().addClass('booked');
                              $(this).parent().children().prop('disabled', true);
                            }
                          });
                        }
                      });
                    });
                  }
                }
              });
            };
            var delayCall = 200;
            setTimeout(getCreateTimeSlot, delayCall);
          }
        }
      }
    });
    listenChange('#appointmentDepartmentId', function () {
      $('.error-message').css('display', 'none');
      // $('#opdDate').data('DateTimePicker').clear();
      opdDate.clear();
      $('.doctor-schedule').css('display', 'none');
      $('.available-slot-heading').css('display', 'none');
      $('.available-slot').css('display', 'none');
      $.ajax({
        url: $('.doctorDepartmentUrl').val(),
        type: 'get',
        dataType: 'json',
        data: {
          id: $(this).val()
        },
        success: function success(data) {
          $('#appointmentDoctorId').empty();
          $('#appointmentDoctorId').append($('<option value="">' + Lang.get('messages.web_home.select_doctor') + '</option>'));
          $.each(data.data, function (i, v) {
            $('#appointmentDoctorId').append($('<option></option>').attr('value', i).text(v));
          });
        }
      });
    });
    var appointmentDoctorId;
    var appointmentDoctorChange = false;
    listenChange('#appointmentDoctorId', function () {
      if (appointmentDoctorChange) {
        $('.doctor-schedule').css('display', 'none');
        $('.available-slot-heading').css('display', 'none');
        $('.available-slot').css('display', 'none');
        $('.error-message').css('display', 'none');
        opdDate.clear();
        appointmentDoctorChange = true;
      }
      $('.error-message').css('display', 'none');
      appointmentDoctorId = $(this).val();
      appointmentDoctorChange = true;
    });

    // if edit record then trigger change
    var appointmentEditTimeSlot;
    if ($('.isEdit').val()) {
      $('#appointmentDoctorId').trigger('change', function (event) {
        appointmentDoctorId = $(this).val();
      });
      $('.opdDate').trigger('dp.change', function () {
        var selected = new Date($(this).val());
      });
    }
    var appointmentEditTimeSlot;
    listenClick('.time-interval', function () {
      appointmentEditTimeSlot = $(this).text();
    });

    //Edit appointment
    listenSubmit('#editAppointmentForm', function (event) {
      var editAppointmentOpdDate = $('#appointmentOpdDate').val();
      if (isEmpty(editAppointmentOpdDate)) {
        $('#editAppointmentErrorsBox').show().removeClass('d-none').html(Lang.get('messages.new_change.select_appointment_date')).delay(5000).slideUp(300);
        return false;
      }
      if (appointmentEditTimeSlot == null || appointmentEditTimeSlot == '') {
        $('#editAppointmentErrorsBox').show().html(Lang.get('messages.new_change.select_time_slot')).delay(5000).slideUp(300);
        return false;
      }
      event.preventDefault();
      screenLock();
      var formData = $(this).serialize() + '&time=' + appointmentEditTimeSlot;
      $.ajax({
        url: $('#appointmentUpdateUrl').val(),
        type: 'POST',
        dataType: 'json',
        data: formData,
        success: function success(result) {
          displaySuccessMessage(result.message);
          window.location.href = $('.appointmentIndexPage').val();
        },
        error: function error(result) {
          printErrorMessage('#editAppointmentErrorsBox', result);
          screenUnLock();
        }
      });
    });
  } else {
    return false;
  }
}

//slot click change color
var appointmentSelectedTime;
listenClick('.time-interval', function (event) {
  var appointmentId = $(event.currentTarget).attr('data-id');
  if ($(this).data('id') == appointmentId) {
    if ($(this).parent().hasClass('booked')) {
      $('.time-slot-book').css('background-color', '#ffa0a0');
    }
  }
  appointmentSelectedTime = $(this).text();
  $('.time-slot').removeClass('time-slot-book');
  $(this).parent().addClass('time-slot-book');
});

//create appointment
listenSubmit('#appointmentForm', function (event) {
  var appointmentOpdDate = $('#appointmentOpdDate').val();
  if (isEmpty(appointmentOpdDate)) {
    $('#createAppointmentErrorsBox').show().removeClass('d-none').html(Lang.get('messages.new_change.select_appointment_date')).delay(5000).slideUp(300);
    return false;
  }
  if (appointmentSelectedTime == null || appointmentSelectedTime == '') {
    $('#createAppointmentErrorsBox').show().removeClass('d-none').html(Lang.get('messages.new_change.select_time_slot')).delay(5000).slideUp(300);
    return false;
  }
  event.preventDefault();
  screenLock();
  var formData = $(this).serialize() + '&time=' + appointmentSelectedTime;
  $.ajax({
    url: $('#saveAppointmentURLID').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.appointmentIndexPage').val();
    },
    error: function error(result) {
      printErrorMessage('#createAppointmentErrorsBox', result);
      screenUnLock();
    },
    complete: function complete() {
      processingBtn('#appointmentForm', '#saveAppointment');
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./resources/assets/js/brands/brands.js ***!
  \**********************************************/


listenClick('.brand-delete-btn', function (event) {
  var brandId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexBrandUrl').val() + '/' + brandId, '', $('#medicineBrandLang').val());
});
listenSubmit('#createBrandForm, #editBrandForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/brands/medicine_brands_list.js ***!
  \************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/assets/js/category/category.js ***!
  \**************************************************/
listenSubmit('#addMedicineCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#medicineCategorySave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#indexCategoryCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_categories_modal').modal('hide');
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#medicineCategoryErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editMedicineCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editCategorySave');
  loadingButton.button('loading');
  var id = $('#editMedicineCategoryId').val();
  $.ajax({
    url: $('#indexCategoriesUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_categories_modal').modal('hide');
        if ($('#categoriesShowUrl').length) {
          window.location.href = $('#categoriesShowUrl').val();
        } else {
          livewire.emit('refresh');
        }
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_categories_modal', function () {
  resetModalForm('#addMedicineCategoryForm', '#medicineCategoryErrorsBox');
});
listenHiddenBsModal('#edit_categories_modal', function () {
  resetModalForm('#editMedicineCategoryForm', '#editMedicineCategoryErrorsBox');
});
window.renderCategoryData = function (id) {
  $.ajax({
    url: $('#indexCategoriesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var category = result.data;
        $('#editMedicineCategoryId').val(category.id);
        $('#edit_name').val(category.name);
        if (category.is_active === 1) $('#edit_is_active').prop('checked', true);else $('#edit_is_active').prop('checked', false);
        $('#edit_categories_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenClick('.category-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var categoryId = $(event.currentTarget).attr('data-id');
  renderCategoryData(categoryId);
});
listenClick('.category-delete-btn', function (event) {
  var categoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexCategoriesUrl').val() + '/' + categoryId, '#categoriesTable', $('#medicineCategoryLang').val());
});

// category activation deactivation change event
listenChange('.category-status', function (event) {
  var categoryId = $(event.currentTarget).data('id');
  activeDeActiveCategory(categoryId);
});
listenClick('#categoryResetFilter', function () {
  $('#medicineCategoryHead').val(2).trigger('change');
  hideDropdownManually($('#medicineCategoryFilterBtn'), $('.dropdown-menu'));
});

// activate de-activate category
window.activeDeActiveCategory = function (id) {
  $.ajax({
    url: $('#indexCategoriesUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    }
  });
};
listenChange('#medicineCategoryHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  hideDropdownManually($('#medicineCategoryFilterBtn'), $('#medicineCategoryFilter'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/category/medicines_list.js ***!
  \********************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************!*\
  !*** ./resources/assets/js/nurses/nurses.js ***!
  \**********************************************/
listenClick('.deleteNurseBtn', function (event) {
  var nurseId = $(event.currentTarget).data('id');
  deleteItem($('#nurseURL').val() + '/' + nurseId, '#nursesTbl', $('#nurseLang').val());
});
listenChange('#nurse_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  // $(tableName).DataTable().ajax.reload(null, true)
});
listenChange('.nurseStatus', function (event) {
  var nurseId = $(event.currentTarget).data('id');
  updateNurseStatus(nurseId);
});
listenClick('#nurseResetFilter', function () {
  $('#nurse_filter_status').val(0).trigger('change');
  hideDropdownManually($('#nursesFilter'), $('.dropdown-menu'));
});
window.updateNurseStatus = function (id) {
  $.ajax({
    url: $('#nurseURL').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        // tbl.ajax.reload(null, false)
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************!*\
  !*** ./resources/assets/js/nurses/nurses_data_listing.js ***!
  \***********************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************!*\
  !*** ./resources/assets/js/nurses/create-edit.js ***!
  \***************************************************/
document.addEventListener('turbo:load', loadNurseData);
function loadNurseData() {
  if (!$('#createNurseForm').length && !$('#editNurseForm').length) {
    return;
  }
  $('#nurseBloodGroup').select2({
    width: '100%'
  });
  $('#editNurseBloodGroup').select2({
    width: '100%'
  });
  $('.nurseBirthDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
  $('#createNurseForm, #editNurseForm').find('input:text:visible:first').focus();
}
listenSubmit('#createNurseForm, #editNurseForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************!*\
  !*** ./resources/assets/js/doctors/doctors.js ***!
  \************************************************/


listenClick('.doctor-delete-btn', function (event) {
  var doctorId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexDoctorUrl').val() + '/' + doctorId, '#doctorsTable', $('#doctorLang').val());
});
listenChange('.doctor-active-status', function (event) {
  var doctorId = $(event.currentTarget).attr('data-id');
  updateDoctorActiveStatus(doctorId);
});
function updateDoctorActiveStatus(id) {
  $.ajax({
    url: $('#indexDoctorUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
;
listenClick('#doctorResetFilter', function () {
  $('#doctorsHead').val(2).trigger('change');
  hideDropdownManually($('#doctorsFilterBtn'), $('.dropdown-menu'));
});
listenChange('#doctorsHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************!*\
  !*** ./resources/assets/js/doctors/doctors_data_listing.js ***!
  \*************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/doctors/create-edit.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadDoctorsCreateEdit);
function loadDoctorsCreateEdit() {
  if ($('#createDoctorForm').length || $('#editDoctorForm').length) {
    var doctorBloodGroupElement = $('#doctorBloodGroup');
    var editDoctorBloodGroupElement = $('#editDoctorBloodGroup');
    var departmentIdElement = $('#departmentId');
    var doctorsDepartmentIdElement = $('#doctorsDepartmentId');
    var editDoctorsDepartmentIdElement = $('#editDoctorsDepartmentId');
    var createDoctorFormElement = $('#createDoctorForm');
    var editDoctorFormElement = $('#editDoctorForm');
    var doctorBirthDateElement = $('#doctorBirthDate');
    var editDoctorBirthDateElement = $('#editDoctorBirthDate');
    if (doctorBloodGroupElement.length) {
      $('#doctorBloodGroup').select2({
        width: '100%'
      });
    }
    if (editDoctorBloodGroupElement.length) {
      $('#editDoctorBloodGroup').select2({
        width: '100%'
      });
    }
    if (departmentIdElement.length) {
      $('#departmentId').select2({
        width: '100%'
      });
    }
    if (doctorsDepartmentIdElement.length) {
      $('#doctorsDepartmentId').select2({
        width: '100%'
      });
    }
    if (editDoctorsDepartmentIdElement.length) {
      $('#editDoctorsDepartmentId').select2({
        width: '100%'
      });
    }
    if (createDoctorFormElement.length) {
      $('#createDoctorForm').find('input:text:visible:first').focus();
    }
    if (editDoctorFormElement.length) {
      $('#editDoctorForm').find('input:text:visible:first').focus();
    }
    if (doctorBirthDateElement.length) {
      $('#doctorBirthDate').flatpickr({
        maxDate: new Date(),
        locale: $('.userCurrentLanguage').val()
      });
    }
    if (editDoctorBirthDateElement.length) {
      $('#editDoctorBirthDate').flatpickr({
        maxDate: new Date(),
        locale: $('.userCurrentLanguage').val()
      });
    }
  } else {
    return false;
  }
}
listenKeyup('#doctorFacebookUrl,#editDoctorFacebookUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#doctorTwitterUrl,#editDoctorTwitterUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#doctorInstagramUrl,#editDoctorInstagramUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#doctorLinkedInUrl,#editDoctorLinkedInUrl', function () {
  this.value = this.value.toLowerCase();
});
listenSubmit('#createDoctorForm, #editDoctorForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
  var facebookUrl = $('.facebookUrl').val();
  var twitterUrl = $('.twitterUrl').val();
  var instagramUrl = $('.instagramUrl').val();
  var linkedInUrl = $('.linkedInUrl').val();
  Lang.setLocale($('.userCurrentLanguage').val());
  var facebookExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)facebook.[a-z]{2,3}\/?.*/i);
  var twitterExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)twitter\.[a-z]{2,3}\/?.*/i);
  var instagramUrlExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)instagram.[a-z]{2,3}\/?.*/i);
  var linkedInExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)linkedin\.[a-z]{2,3}\/?.*/i);
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  if (!facebookCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_facebook_url'));
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_twitter_url'));
    return false;
  }
  var instagramCheck = instagramUrl == '' ? true : instagramUrl.match(instagramUrlExp) ? true : false;
  if (!instagramCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_linkedin_url'));
    return false;
  }
});
listenClick('.doctor-remove-image', function () {
  defaultImagePreview('.previewImage', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/lab_technicians/lab_technicians.js ***!
  \****************************************************************/
listen('click', '.deleteTechnicianBtn', function (event) {
  var labTechnicianId = $(event.currentTarget).attr('data-id');
  deleteItem($('#labTechnicianURL').val() + '/' + labTechnicianId, '', $('#labTechnicianLang').val());
});
listenChange('.technicianStatus', function (event) {
  var labTechnicianId = $(event.currentTarget).attr('data-id');
  updateLabTechnicianStatus(labTechnicianId);
});
listenChange('#technicianFilterStatus', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listen('click', '#technicianResetFilter', function () {
  $('#technicianFilterStatus').val(0).trigger('change');
  hideDropdownManually($('#labTechnicianFilterBtn'), $('.dropdown-menu'));
});
window.updateLabTechnicianStatus = function (id) {
  $.ajax({
    url: $('#labTechnicianURL').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************************!*\
  !*** ./resources/assets/js/lab_technicians/lab_technicians_data_listing.js ***!
  \*****************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/lab_technicians/create-edit.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadLabTechnicianData);
function loadLabTechnicianData() {
  if (!$('#createLabTechnicianForm').length && !$('#editLabTechnicianForm').length) {
    return;
  }
  $('#technicianBloodGroup').select2({
    width: '100%'
  });
  $('#editTechnicianBloodGroup').select2({
    width: '100%'
  });
  $('.departmentId').select2({
    width: '100%'
  });
  var birthDate = $('.technicianBirthDate').flatpickr({
    dateFormat: 'Y-m-d',
    useCurrent: false,
    locale: $('.userCurrentLanguage').val()
  });
  // birthDate.setDate(isEmpty($('#birthDate').val()) ? new Date() : $('#birthDate').val());
  birthDate.set('maxDate', new Date());
}
listenSubmit('#createLabTechnicianForm, #editLabTechnicianForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
$('#createLabTechnicianForm, #editLabTechnicianForm').find('input:text:visible:first').focus();
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/receptionists/receptionists.js ***!
  \************************************************************/
listenClick('.delete-receptionist-btn', function (event) {
  var receptionistId = $(event.currentTarget).attr('data-id');
  deleteItem($('#receptionistUrl').val() + '/' + receptionistId, '#receptionistsTbl', $('#receptionistLang').val());
});
listenChange('#receptionist_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('.receptionistStatus', function (event) {
  var receptionistId = $(event.currentTarget).attr('data-id');
  updateReceptionistStatus(receptionistId);
});
listenClick('#receptionistResetFilter', function () {
  $('#receptionist_filter_status').val(2).trigger('change');
  hideDropdownManually($('#receptionistFilter'), $('.dropdown-menu'));
});
window.updateReceptionistStatus = function (id) {
  $.ajax({
    url: $('#receptionistUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************************!*\
  !*** ./resources/assets/js/receptionists/receptionists_data_listing.js ***!
  \*************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/receptionists/create-edit.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadEditReceptionistsData);
function loadEditReceptionistsData() {
  createReceptionistForm();
  editReceptionistForm();
}
function createReceptionistForm() {
  if (!$('#receptionistBirthDate').length) {
    return;
  }
  $('#receptionistBirthDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
  $('#receptionistBloodGroup').select2({
    width: '100%'
  });

  // $('#receptionistDepartmentId').select2({
  //     width: '100%',
  // });
  $('#createReceptionForm').find('input:text:visible:first').focus();
}
function editReceptionistForm() {
  if (!$('#editReceptionistBirthDate').length) {
    return;
  }
  $('#editReceptionistBirthDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
  $('#editReceptionistBloodGroup').select2({
    width: '100%'
  });
  $('#editReceptionForm').find('input:text:visible:first').focus();
}
listenSubmit('#createReceptionForm, #editReceptionForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
listenClick('.remove-receptionist-image', function () {
  defaultImagePreview('#receptionistPreviewImage', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/pharmacists/pharmacists.js ***!
  \********************************************************/
listenClick('.delete-pharmacist-btn', function (event) {
  var pharmacistId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexPharmacistUrl').val() + '/' + pharmacistId, '#pharmacistsTable', $('#pharmacistLang').val());
});
listenChange('#pharmacist_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  // $(tableName).DataTable().ajax.reload(null, true);
});
listenChange('.pharmacistStatus', function (event) {
  var pharmacistId = $(event.currentTarget).attr('data-id');
  updatePharmacistsStatus(pharmacistId);
});
listenClick('#pharmacistResetFilter', function () {
  $('#pharmacist_filter_status').val(0).trigger('change');
  hideDropdownManually($('#pharmacistsFilter'), $('.dropdown-menu'));
});
window.updatePharmacistsStatus = function (id) {
  $.ajax({
    url: $('#indexPharmacistUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
        // tbl.ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************************!*\
  !*** ./resources/assets/js/pharmacists/pharmacists_data_listing.js ***!
  \*********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/pharmacists/create-edit.js ***!
  \********************************************************/
document.addEventListener('turbo:load', loadEditPharmacistData);
function loadEditPharmacistData() {
  if (!$('#createPharmacistForm').length && !$('#editPharmacistForm').length) {
    return;
  }
  var birthDate = $('.pharmacistBirthDate').flatpickr({
    dateFormat: 'Y-m-d',
    useCurrent: false,
    locale: $('.userCurrentLanguage').val()
  });
  // birthDate.setDate(isEmpty($('#birthDate').val()) ? new Date() : $('#birthDate').val());
  birthDate.set('maxDate', new Date());
  // if ($('.departmentId').length) {
  //     $('.departmentId').select2({
  //         width: '100%',
  //     });
  // }
  $('#createPharmacistForm, #editPharmacistForm').find('input:text:visible:first').focus();
}
listenSubmit('#createPharmacistForm, #editPharmacistForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
listenClick('.remove-pharmacist-image', function () {
  defaultImagePreview('.previewImage', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/assets/js/patients/patients.js ***!
  \**************************************************/
listenChange('#patientFilterStatus', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('.patient-status', function (event) {
  var patientId = $(event.currentTarget).attr('data-id');
  updatePatientStatus(patientId);
});
listenClick('#resetPatientFilter', function () {
  $('#patientFilterStatus').val(0).trigger('change');
  hideDropdownManually($('#patientFilterBtn'), $('.dropdown-menu'));
});
listenClick('.delete-patient-btn', function (event) {
  var patientId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexPatientUrl').val() + '/' + patientId, '', $('#patientLang').val());
});
window.updatePatientStatus = function (id) {
  $.ajax({
    url: $('#indexPatientUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};

// patient user email verify code
listenChange('.is-verified', function (event) {
  var userId = $(event.currentTarget).data('id');
  $.ajax({
    url: $('#userUrl').val() + '/' + userId + '/is-verified',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#patientsTable').DataTable().ajax.reload(null, false);
      }
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************************************!*\
  !*** ./resources/assets/js/patients/patients_data_listing.js ***!
  \***************************************************************/


document.addEventListener('turbo:load', loadPatientListingData);
function loadPatientListingData() {
  if (!$('#showPatientUrl').length) {
    return;
  }
  $('#editPatientPaymentDate').flatpickr({
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  $('#editAdvancedPaymentModal').on('shown.bs.modal', function () {
    $('#editPatientPaymentId:first').focus();
  });
  $('#editVaccinationDoesGivenDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  listenShownBsModal('#editPatientVaccinationModal', function () {
    $('#editPatientVaccinationName, #editVaccinationPatientName').select2({
      width: '100%',
      dropdownParent: $('#editPatientVaccinationModal')
    });
  });
  loadDeleteFunction();
}
listenClick('.edit-advancedPayment-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var advancedPaymentId = $(event.currentTarget).attr('data-id');
  renderPatientListingData(advancedPaymentId);
});
window.renderPatientListingData = function (id) {
  $.ajax({
    url: $('#showPatientAdvancedPaymentUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#patientAdvancePaymentId').val(result.data.id);
        $('#editPatientPaymentId').val(result.data.patient_id).trigger('change.select2');
        $('#editPatientPaymentReceiptNo').val(result.data.receipt_no);
        $('#editPatientPaymentAmount').val(result.data.amount);
        $('.price-input').trigger('input');
        document.querySelector('#editPatientPaymentDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editAdvancedPaymentModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editAdvancedPaymentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditSave');
  loadingButton.button('loading');
  var id = $('#patientAdvancePaymentId').val();
  $.ajax({
    url: $('#showPatientAdvancedPaymentUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editAdvancedPaymentModal').modal('hide');
        location.reload();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#editAdvancedPaymentModal', function () {
  resetModalForm('#editAdvancedPaymentForm', '#editPatientPaymentErrorsBox');
});
listenClick('.edit-vaccination-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var vaccinatedPatientId = $(event.currentTarget).attr('data-id');
  renderVaccinationedData(vaccinatedPatientId);
});
window.renderVaccinationedData = function (id) {
  $.ajax({
    url: $('#showVaccinatedPatientUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var vaccinatedPatient = result.data;
        $('#vaccinatedPatientId').val(vaccinatedPatient.id);
        $('#editVaccinationPatientName').val(vaccinatedPatient.patient_id).trigger('change.select2');
        $('#editPatientVaccinationName').val(vaccinatedPatient.vaccination_id).trigger('change.select2');
        $('#editVaccinationSerialNo').val(vaccinatedPatient.vaccination_serial_number);
        $('#editVaccinationDoseNumber').val(vaccinatedPatient.dose_number);
        document.querySelector('#editVaccinationDoesGivenDate')._flatpickr.setDate(moment(vaccinatedPatient.dose_given_date).format());
        $('#editVaccinationDescription').val(vaccinatedPatient.description);
        $('#editPatientVaccinationModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editPatientVaccinationForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editBtnSave');
  loadingButton.button('loading');
  var id = $('#vaccinatedPatientId').val();
  $.ajax({
    url: $('#showVaccinatedPatientUrl').val() + '/' + id + '/update',
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editPatientVaccinationModal').modal('hide');
        location.reload();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#editPatientVaccinationModal', function () {
  resetModalForm('#editPatientVaccinationForm', '#editPatientVaccinationErrorsBox1');
});
function loadDeleteFunction() {
  if (!$('#showPatientUrl').length) {
    return;
  }
  listenClick('.delete-btn', function (event) {
    var Ele = $(this);
    var id = $(event.currentTarget).attr('data-id');
    var url = $(this).data('url');
    var message = $(this).data('message');
    deleteItem(url + '/' + id, '', message);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************!*\
  !*** ./resources/assets/js/patients/create-edit.js ***!
  \*****************************************************/
document.addEventListener('turbo:load', loadPatientData);
function loadPatientData() {
  if (!$('#createPatientForm').length && !$('#editPatientForm').length) {
    return;
  }
  $('.patientBirthDate').flatpickr({
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
}
listenKeyup('.patientFacebookUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('.patientTwitterUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('.patientInstagramUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('.patientLinkedInUrl', function () {
  this.value = this.value.toLowerCase();
});
listenSubmit('#createPatientForm, #editPatientForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
  var facebookUrl = $('.patientFacebookUrl').val();
  var twitterUrl = $('.patientTwitterUrl').val();
  var instagramUrl = $('.patientInstagramUrl').val();
  var linkedInUrl = $('.patientLinkedInUrl').val();
  var facebookExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)facebook.[a-z]{2,3}\/?.*/i);
  var twitterExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)twitter\.[a-z]{2,3}\/?.*/i);
  var instagramUrlExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)instagram.[a-z]{2,3}\/?.*/i);
  var linkedInExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)linkedin\.[a-z]{2,3}\/?.*/i);
  Lang.setLocale($('.userCurrentLanguage').val());
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  if (!facebookCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_facebook_url'));
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_twitter_url'));
    return false;
  }
  var instagramCheck = instagramUrl == '' ? true : instagramUrl.match(instagramUrlExp) ? true : false;
  if (!instagramCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_linkedin_url'));
    return false;
  }
});
$('#createPatientForm, #editPatientForm').find('input:text:visible:first').focus();
listenClick('.remove-patient-image', function () {
  defaultImagePreview('.previewImage', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/accountants/accountants.js ***!
  \********************************************************/
listenClick('.accountant-delete-btn', function (event) {
  var accountantId = $(event.currentTarget).attr('data-id');
  deleteItem($('#accountantIndexURL').val() + '/' + accountantId, '#accountantsTbl', $('#Accountant').val());
});
listenChange('.accountant-status', function (event) {
  var accountantId = $(event.currentTarget).attr('data-id');
  updateAccountantStatus(accountantId);
});
window.updateAccountantStatus = function (id) {
  $.ajax({
    url: $('#accountantIndexURL').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listen('change', '#accountant_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#accountantResetFilter', function () {
  $('#accountant_filter_status').val(0).trigger('change');
  hideDropdownManually($('#accountantFilterBtn'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************************!*\
  !*** ./resources/assets/js/accountants/accountants_data_listing.js ***!
  \*********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/accountants/create-edit.js ***!
  \********************************************************/
document.addEventListener('turbo:load', loadAccountantCreateData);
function loadAccountantCreateData() {
  $('#accountantBloodGroup, #editAccountantBloodGroup').select2({
    width: '100%'
  });
  $('#accountantBirthDate, #editAccountantBirthDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
  listenSubmit('#createAccountantForm, #editAccountantForm', function () {
    if ($('.error-msg').text() !== '') {
      $('.phoneNumber').focus();
      return false;
    }
  });
  $('#createAccountantForm, #editAccountantForm').find('input:text:visible:first').focus();
  listenClick('.remove-image', function () {
    defaultImagePreview('#previewImage', 1);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/custom/input_price_format.js ***!
  \**********************************************************/


window.setPrice = function (selector, price) {
  if (price != '' || price > 0) {
    if (typeof price !== 'number') {
      price = price.replace(/,/g, '');
    }
    var formattedPrice = addCommas(price);
    $(selector).val(formattedPrice);
  }
};
window.addCommas = function (nStr) {
  nStr += '';
  var x = nStr.split('.');
  var x1 = x[0];
  var x2 = x.length > 1 ? '.' + x[1] : '';
  var rgx = /(\d+)(\d{3})/;
  while (rgx.test(x1)) {
    x1 = x1.replace(rgx, '$1' + ',' + '$2');
  }
  return x1 + x2;
};
window.getFormattedPrice = function (price) {
  if (price != '' || price > 0) {
    if (typeof price !== 'number') {
      price = price.replace(/,/g, '');
    }
    return addCommas(price);
  }
};
window.priceFormatSelector = function (selector) {
  listen('input keyup keydown keypress', selector, function (event) {
    var price = $(this).val();
    if (price === '') {
      $(this).val('');
    } else {
      if (/^[0-9]+(,[0-9]+)*$/.test(price)) {
        $(this).val(getFormattedPrice(price));
        return true;
      } else {
        $(this).val(price.replace(/\D/g, ''));
      }
    }
  });
};
window.removeCommas = function (str) {
  return str.replace(/,/g, '');
};
priceFormatSelector('.price-input');
listenKeyup('.decimal-number', function () {
  var price = $(this);
  price.val(price.val().replace(/[^\d.]/g, ''));
  if (price.val().includes('.') && $(this).val().substring($(this).val().indexOf('.'), $(this).val().indexOf('.').length).length > 3) {
    price.val(price.val().slice(0, -1));
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************!*\
  !*** ./resources/assets/js/bills/bill.js ***!
  \*******************************************/


listenClick('.bill-delete-btn', function (event) {
  var id = $(event.currentTarget).data('id');
  deleteItem($('#indexBillUrl').val() + '/' + id, '', $('#billLang').val());
});
listenChange('.make-bill-payment', function (event) {
  var _this = this;
  event.preventDefault();
  swal({
    title: Lang.get("messages.lunch_break.are_u_sure"),
    text: Lang.get("messages.lunch_break.u_want_to_complete_this_payment"),
    icon: "warning",
    buttons: {
      confirm: $(".yesVariable").val(),
      cancel: $(".noVariable").val() + ", " + $(".cancelVariable").val()
    }
  }).then(function (result) {
    if (result) {
      var billID = $(_this).attr('data-id');
      var paymentID = $(_this).val();
      $.ajax({
        url: route('bill.payment', billID),
        method: 'post',
        cache: false,
        data: {
          amount: $('.bill-amount').val(),
          id: billID,
          paymentType: paymentID
        },
        success: function success(data) {
          if (data.data == null) {
            displaySuccessMessage(data.message);
            window.livewire.emit('refresh');
          } else {
            if (data.data.payment_type == 1) {
              var stripe = Stripe(data.data.stripe_key);
              var sessionId = data.data[0].sessionId;
              stripe.redirectToCheckout({
                sessionId: sessionId
              }).then(function (mainResult) {
                return manageAjaxErrors(mainResult);
              });
            }
          }
        },
        error: function error(result) {
          displayErrorMessage(result.responseJSON.message);
        }
      });
      // $.ajax({
      //     url: route("manual-billing-payments.store"),
      //     type: "POST",
      //     data: { id: id, payment_type: payment_type },
      //     success: function (data) {
      //         if (data.data == null) {
      //             displaySuccessMessage(data.message);
      //             Livewire.emit("refresh");
      //         }else{
      //             if (data.data.payment_type == "0") {
      //                 let sessionId = data.data[0].sessionId;
      //                 stripe.redirectToCheckout({
      //                     sessionId: sessionId,
      //                 })
      //                 .then(mainResult => manageAjaxErrors(mainResult));
      //             }
      //         }
      //     },
      // });
    } else {
      Livewire.emit("refresh");
    }
  });
  // if(paymentID == 1){

  // }
  // if(paymentID == 2){
  //     $.ajax({
  //         url: route('bill.payment', billID),
  //         method: 'post',
  //         cache: false,
  //         data:{
  //             amount:$('.bill-amount').val(),
  //             id:billID,
  //             paymentType:paymentID,
  //         },
  //         success: function (result) {
  //             if (result.success) {
  //                 displaySuccessMessage(result.message)
  //                 window.livewire.emit('refresh')
  //             }
  //         },
  //         error: function (result) {
  //             displayErrorMessage(result.responseJSON.message)
  //         },
  //     });
  // }
});
listenChange('.bill-payment-approve', function () {
  var id = $(this).attr('data-id');
  var status = $(this).val();
  $.ajax({
    url: route('change-bill-payment-status', id),
    type: 'GET',
    data: {
      id: id,
      status: status
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.livewire.emit('refresh');
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************!*\
  !*** ./resources/assets/js/bills/new.js ***!
  \******************************************/


document.addEventListener('turbo:load', loadBillEdit);
function loadBillEdit() {
  if (!$('#billForm').length) {
    return false;
  }
  var femaleElement = $('#female');
  var maleElement = $('#male');
  var patientIdElement = $('#patient_id');
  var patientAdmissionIdElement = $('#patientAdmissionId');
  var billDateIdElement = $('#bill_date');
  var editBillDateElement = $('#editBillDate');
  $('input:text:not([readonly="readonly"])').first().blur();
  if (femaleElement.length) {
    $('#female').attr('disabled', true);
  }
  if (maleElement.length) {
    $('#male').attr('disabled', true);
  }
  if (patientIdElement.length) {
    $('#patient_id').select2({
      width: '100%'
    });
  }
  if (patientAdmissionIdElement.length) {
    $('#patientAdmissionId').select2({
      width: '100%'
    });
  }
  if (billDateIdElement.length) {
    $('#bill_date').flatpickr({
      enableTime: true,
      defaultDate: new Date(),
      dateFormat: 'Y-m-d H:i',
      locale: $('.userCurrentLanguage').val()
    });
  }
  if (editBillDateElement.length) {
    $('#editBillDate').flatpickr({
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      locale: $('.userCurrentLanguage').val()
    });
  }
  billDropdownToSelect2('.accountId');
}
var billDropdownToSelect2 = function billDropdownToSelect2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.medicine_bills.select_medicine'),
    width: '100%'
  });
};
listenClick('#addBillItem', function () {
  var uniqueId = $('.uniqueId').val();
  var data = {
    'medicines': JSON.parse($('.associateMedicines').val()),
    'uniqueId': uniqueId
  };
  var invoiceItemHtml = prepareTemplateRender('#billItemTemplate', data);
  $('.bill-item-container').append(invoiceItemHtml);
  billDropdownToSelect2('.medicineId');
  uniqueId++;
  billResetInvoiceItemIndex();
});
var billResetInvoiceItemIndex = function billResetInvoiceItemIndex() {
  var index = 1;
  $('.bill-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    $('#billTbl tbody').append('<tr>' + '<td class="text-center item-number">1</td>' + '<td class="table__item-desc">' + '<input class="form-control itemName" required name="item_name[]" type="text"></td>' + '<td class="table__qty"><input class="form-control qty quantity" required name="qty[]" type="text"></td>' + '<td><input class="form-control price-input price" required name="price[]" type="text"></td>' + '<td class="amount text-right itemTotal"></td>' + '<td class="text-center"><i class="fa fa-trash text-danger delete-bill-bulk-item pointer"></i></td>' + '</tr>');
  }
};
listenClick('.delete-bill-bulk-item', function () {
  $(this).parents('tr').remove();
  billResetInvoiceItemIndex();
  billCalculateAndSetInvoiceAmount();
});
var removeCommas = function removeCommas(str) {
  return str.replace(/,/g, '');
};
listenKeyup('.qty', function () {
  var qty = parseInt($(this).val());
  var rate = $(this).parent().siblings().find('.price').val();
  rate = parseInt(removeCommas(rate));
  var amount = billCalculateAmount(qty, rate);
  $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
  billCalculateAndSetInvoiceAmount();
});
listenKeyup('.price', function () {
  var rate = $(this).val();
  rate = parseInt(removeCommas(rate));
  var qty = parseInt($(this).parent().siblings().find('.qty').val());
  var amount = billCalculateAmount(qty, rate);
  $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
  billCalculateAndSetInvoiceAmount();
});
var billCalculateAmount = function billCalculateAmount(qty, rate) {
  if (qty > 0 && rate > 0) {
    return qty * rate;
  } else {
    return 0;
  }
};
var billCalculateAndSetInvoiceAmount = function billCalculateAndSetInvoiceAmount() {
  var totalAmount = 0;
  $('.bill-item-container>tr').each(function () {
    var itemTotal = $(this).find('.itemTotal').text();
    itemTotal = removeCommas(itemTotal);
    itemTotal = isEmpty($.trim(itemTotal)) ? 0 : parseInt(itemTotal);
    totalAmount += itemTotal;
  });
  totalAmount = parseFloat(totalAmount);
  $('#totalPrice').text(addCommas(totalAmount.toFixed(2)));

  //set hidden input value
  $('#totalAmount').val(totalAmount);
};
listenSubmit('#billForm', function (event) {
  event.preventDefault();
  // screenLock();
  $('#billSave').attr('disabled', true);
  var loadingButton = jQuery(this).find('#saveInvoiceBtn');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.billSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.billUrl').val() + '/' + result.data.id;
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#billSave').attr('disabled', false);
    }
    // complete: function () {
    //     screenUnLock();
    //     loadingButton.button('reset');
    // },
  });
});

// bill auto fill data script code
listenChange('#patientAdmissionId', function () {
  // screenLock();
  $('#patientAdmissionId').attr('disabled', true);
  var data;
  if ($(this).val() != '' && $(this).val() != null) {
    $('#patientAdmissionId').attr('disabled', false);
    if ($('.isEdit').val()) {
      data = {
        editBillId: $('.billId').val(),
        patient_admission_id: $(this).val()
      };
    } else {
      data = {
        patient_admission_id: $(this).val()
      };
    }
    $.ajax({
      url: $('.patientAdmissionDetailUrl').val(),
      type: 'GET',
      data: data,
      success: function success(result) {
        if (result.success) {
          var patientAdmissionData = result.data;
          $('#pAdmissionId').val($('#patientAdmissionId').find(':selected').val());
          $('#female,#male').attr('disabled', true);
          $('#billsPatientId').val(patientAdmissionData.patientDetails.owner_id);
          $('#name').val(patientAdmissionData.patientDetails.full_name);
          $('#userEmail').val(patientAdmissionData.patientDetails.email);
          $('#userPhone').val(patientAdmissionData.patientDetails.phone != null ? patientAdmissionData.patientDetails.phone : 'N/A');
          if (patientAdmissionData.patientDetails.gender == 1) $('#female').prop('checked', true);else $('#male').prop('checked', true);
          $('#dob').val(patientAdmissionData.patientDetails.dob != null ? patientAdmissionData.patientDetails.dob : 'N/A');
          $('#billDoctorId').val(patientAdmissionData.doctorName);
          $('#admissionDate').val(patientAdmissionData.admissionDetails.admission_date);
          $('#dischargeDate').val(patientAdmissionData.admissionDetails.discharge_date != null ? patientAdmissionData.admissionDetails.discharge_date : 'N/A');
          if (patientAdmissionData["package"] != '') {
            $('#packageId').val(patientAdmissionData["package"].name != null ? patientAdmissionData["package"].name : 'N/A');
          } else {
            $('#packageId').val('N/A');
          }
          if (patientAdmissionData.admissionDetails.insurance != null) {
            $('#insuranceId').val(patientAdmissionData.admissionDetails.insurance.name);
          } else {
            $('#insuranceId').val('N/A');
          }
          $('#totalDays').val(patientAdmissionData.admissionDetails.totalDays);
          $('#policyNo').val(patientAdmissionData.admissionDetails.policy_no != '' ? patientAdmissionData.admissionDetails.policy_no : 'N/A');
          if (patientAdmissionData["package"] != '' || patientAdmissionData["package"] == '' || !patientAdmissionData.hasOwnProperty('billItems') || patientAdmissionData.hasOwnProperty('billItems') || patientAdmissionData.billItems.length <= 0 || patientAdmissionData.billItems.length >= 0) {
            $('.bill-item-container tr').each(function () {
              var itemRow = $(this).closest('tr');
              itemRow.remove();
            });
            $('#totalPrice').text('0');
            $('#billTbl tbody').append('<tr>' + '<td class="text-center item-number">1</td>' + '<td class="table__item-desc">' + '<input class="form-control itemName" required name="item_name[]" type="text"></td>' + '<td class="table__qty"><input class="form-control qty quantity" required name="qty[]" type="text"></td>' + '<td><input class="form-control price-input price" required name="price[]" type="text"></td>' + '<td class="amount text-right itemTotal"></td>' + '<td class="text-center"><i class="fa fa-trash text-danger delete-bill-bulk-item pointer"></i></td>' + '</tr>');
          }
          if (patientAdmissionData["package"] != '' && patientAdmissionData.hasOwnProperty('billItems') && patientAdmissionData.billItems.length > 0) {
            var totalBillItems = patientAdmissionData.billItems.length - 1;
            $('#totalAmount').val(0);
            var total = 0;
            for (var i = 1; i <= totalBillItems; i++) {
              $('#addBillItem').trigger('click');
            }
            $('.bill-item-container tr').each(function (index) {
              var itemRow = $(this);
              itemRow.find('.itemName').val(patientAdmissionData.billItems[index].item_name);
              itemRow.find('.quantity').val(patientAdmissionData.billItems[index].qty);
              itemRow.find('.price').val(patientAdmissionData.billItems[index].price);
              itemRow.find('.amount').text(patientAdmissionData.billItems[index].amount);
              total = total + parseInt(itemRow.find('.itemTotal').text());
              $('#totalPrice').text(total);
            });
            $('#totalAmount').val($('#total').text());
            setTimeout(function () {
              $('.price').trigger('keyup');
            }, 500);
          } else if (patientAdmissionData["package"] != '') {
            if (patientAdmissionData["package"].package_services_items.length > 0) {
              var totalPackageServices = patientAdmissionData["package"].package_services_items.length - 1;
              $('#totalAmount').val(0);
              var _total = 0;
              for (var _i = 1; _i <= totalPackageServices; _i++) {
                $('#addBillItem').trigger('click');
              }
              $('.bill-item-container tr').each(function (index) {
                var itemRow = $(this);
                itemRow.find('.itemName').val(patientAdmissionData["package"].package_services_items[index].service.name);
                itemRow.find('.quantity').val(patientAdmissionData["package"].package_services_items[index].quantity);
                itemRow.find('.price').val(patientAdmissionData["package"].package_services_items[index].rate);
                itemRow.find('.amount').text(patientAdmissionData["package"].package_services_items[index].amount);
                _total = _total + parseInt(itemRow.find('.itemTotal').text());
                $('#totalPrice').text(_total);
              });
              $('#totalAmount').val($('#total').text());
            }
          } else if (patientAdmissionData.hasOwnProperty('billItems') && patientAdmissionData.billItems.length > 0) {
            var _totalBillItems = patientAdmissionData.billItems.length - 1;
            $('#totalAmount').val(0);
            var _total2 = 0;
            for (var _i2 = 1; _i2 <= _totalBillItems; _i2++) {
              $('#addBillItem').trigger('click');
            }
            $('.bill-item-container tr').each(function (index) {
              var itemRow = $(this);
              itemRow.find('.itemName').val(patientAdmissionData.billItems[index].item_name);
              itemRow.find('.quantity').val(patientAdmissionData.billItems[index].qty);
              itemRow.find('.price').val(patientAdmissionData.billItems[index].price);
              itemRow.find('.amount').text(patientAdmissionData.billItems[index].amount);
              _total2 = _total2 + parseInt(itemRow.find('.itemTotal').text());
              $('#totalPrice').text(_total2);
            });
            $('#totalAmount').val($('#total').text());
          }
        }
      },
      error: function error(result) {
        manageAjaxErrors(result);
        $('#patientAdmissionId').attr('disabled', false);
      }
      // complete: function (result) {
      //     screenUnLock();
      // },
    });
  } else {
    // screenUnLock();
    $('#patientAdmissionId').attr('disabled', false);
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************!*\
  !*** ./resources/assets/js/bills/edit.js ***!
  \*******************************************/


document.addEventListener('turbo:load', loadBillEdit);
function loadBillEdit() {
  if (!$('#editBillPatientAdmissionId').length) {
    return false;
  }
  setTimeout(function () {
    $('#patientAdmissionId').val($('#editBillPatientAdmissionId').val());
    $('#patientAdmissionId').trigger('change');
  }, 500);
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/blood_donors/blood_donors.js ***!
  \**********************************************************/


document.addEventListener('turbo:load', loadBloodDonors);
function loadBloodDonors() {
  $('#bloodGroup').select2({
    width: '100%',
    dropdownParent: $('#bloodDonorsAddModal')
  });
  $('#editBloodGroup').select2({
    width: '100%',
    dropdownParent: $('#bloodDonorsEditModal')
  });
  var lastDonationDate = $('#lastDonationDate').flatpickr({
    format: 'YYYY-MM-DD HH:mm:ss',
    dateFormat: 'Y-m-d H:i',
    sideBySide: true,
    enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
  var editLastDonationDate = $('#editLastDonationDate').flatpickr({
    // format: 'YYYY-MM-DD HH:mm:ss',
    dateFormat: 'Y-m-d H:i',
    sideBySide: true,
    // enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#bloodDonorsAddNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodDonorsBtnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: $('#bloodDonorCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodDonorsAddModal').modal('hide');
        window.livewire.emit('refresh');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#bloodDonorsValidationErrorsBox', result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#bloodDonorsEditForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodDonorEditBtnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  var id = $('#bloodDonorId').val();
  $.ajax({
    url: $('#bloodDonorUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodDonorsEditModal').modal('hide');
        window.livewire.emit('refresh');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#bloodDonorsAddModal', function () {
  resetModalForm('#bloodDonorsAddNewForm', '#bloodDonorsValidationErrorsBox');
  $('#bloodDonorsBtnSave').attr('disabled', false);
});
listenHiddenBsModal('#bloodDonorsEditModal', function () {
  resetModalForm('#bloodDonorsEditForm', '#bloodDonorsEditValidationErrorsBox');
  $('#bloodDonorEditBtnSave').attr('disabled', false);
});
listenClick('.blood-donors-delete-btn', function (event) {
  var bloodDonorId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bloodDonorUrl').val() + '/' + bloodDonorId, '#bloodDonorsTable', $('#bloodDonorLang').val());
});
listenClick('.blood-donors-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bloodDonorId = $(event.currentTarget).attr('data-id');
  renderBloodDonor(bloodDonorId);
});
function renderBloodDonor(id) {
  $.ajax({
    url: $('#bloodDonorUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var bloodDonor = result.data;
        $('#bloodDonorId').val(bloodDonor.id);
        $('#editName').val(bloodDonor.name);
        $('#editAge').val(bloodDonor.age);
        $('#male,#female').prop('checked', false);
        if (bloodDonor.gender == 0) {
          $('#female').prop('checked', true);
        } else {
          $('#male').prop('checked', true);
        }
        $('#editBloodGroup').val(bloodDonor.blood_group);
        $('#editBloodGroup').trigger('change');
        var editLastDonationDate = $('#editLastDonationDate').flatpickr({
          // format: 'YYYY-MM-DD HH:mm:ss',
          dateFormat: 'Y-m-d H:i',
          sideBySide: true,
          // enableTime: true,
          locale: $('.userCurrentLanguage').val()
        });
        editLastDonationDate.setDate(bloodDonor.last_donate_date + 1);
        $('#bloodDonorsEditModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************!*\
  !*** ./resources/assets/js/blood_banks/blood_banks.js ***!
  \********************************************************/


listenSubmit('#bloodBanksAddNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodBanksBtnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: $('#bloodBankCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        window.livewire.emit('refresh');
        displaySuccessMessage(result.message);
        $('#bloodBanksAddModal').modal('hide');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#bloodBanksValidationErrorsBox', result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#bloodBanksEditForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodBanksEditBtnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  var id = $('#bloodBankId').val();
  $.ajax({
    url: $('#bloodBankUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        window.livewire.emit('refresh');
        displaySuccessMessage(result.message);
        $('#bloodBanksEditModal').modal('hide');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#bloodBanksAddModal', function () {
  $('#bloodBanksBtnSave').attr('disabled', false);
  resetModalForm('#bloodBanksAddNewForm', '#bloodBanksValidationErrorsBox');
});
listenHiddenBsModal('#bloodBanksEditModal', function () {
  $('#bloodBanksEditBtnSave').attr('disabled', false);
  resetModalForm('#bloodBanksEditForm', '#bloodBanksEditValidationErrorsBox');
});
listenClick('.blood-banks-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bloodGroupId = $(event.currentTarget).attr('data-id');
  renderBloodBanks(bloodGroupId);
});
function renderBloodBanks(id) {
  $.ajax({
    url: $('#bloodBankUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var bloodGroup = result.data;
        $('#bloodBankId').val(bloodGroup.id);
        $('#editBloodGroupBank').val(bloodGroup.blood_group);
        $('#editRemainedBags').val(bloodGroup.remained_bags);
        $('#bloodBanksEditModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
listenClick('.blood-banks-delete-btn', function (event) {
  var bloodGroupId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bloodBankUrl').val() + '/' + bloodGroupId, '#bloodBankTable', $('#bloodBankLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/bed_types/bed_types.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadAdminBedTypeData);
function loadAdminBedTypeData() {}
listenClick('.bed-type-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bedTypeId = $(event.currentTarget).attr('data-id');
  renderBedTypeData(bedTypeId);
});
listenClick('.bed-type-delete-btn', function (event) {
  var bedTypeId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bedTypeIndexUrl').val() + '/' + bedTypeId, '#bedTypesTbl', $('#bedTypeLang').val());
});
window.renderBedTypeData = function (id) {
  $.ajax({
    url: $('#bedTypeIndexUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var bedType = result.data;
        $('#bedTypeId').val(bedType.id);
        $('#editTitle').val(bedType.title);
        $('#editDescription').val(bedType.description);
        $('#editBedTypeModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#addNewBedTypeForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: $('#bedTypesCreateURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $(loadingButton).attr('disabled', false);
        $('#addBedTypeModal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editBedTypeForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  var id = $('#bedTypeId').val();
  $.ajax({
    url: $('#bedTypeIndexUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editBedTypeModal').modal('hide');
        livewire.emit('refresh');
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addBedTypeModal', function () {
  resetModalForm('#addNewBedTypeForm', '#validationErrorsBox');
  $('#btnSave').attr('disabled', false);
});
listenHiddenBsModal('#editBedTypeModal', function () {
  resetModalForm('#editBedTypeForm', '#editValidationErrorsBox');
  $('#btnEditSave').attr('disabled', false);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./resources/assets/js/bed_types/beds_view_list.js ***!
  \*********************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************!*\
  !*** ./resources/assets/js/beds/beds.js ***!
  \******************************************/


listenClick('.bed-delete-btn', function (event) {
  var bedId = $(event.currentTarget).data('id');
  deleteItem($('.bedUrl').val() + '/' + bedId, '#bedsTbl', $('#bedLang').val());
});

// status activation deactivation change event
listenChange('.bed-status', function (event) {
  var bedId = $(event.currentTarget).data('id');
  activeDeActiveBedStatus(bedId);
});
listenChange('#bed_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#bedResetFilter', function () {
  $('#bed_filter_status').val(0).trigger('change');
  hideDropdownManually($('#bedAssignFilterBtn'), $('.dropdown-menu'));
});

// activate de-activate Status
function activeDeActiveBedStatus(id) {
  $.ajax({
    url: $('.bedUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        // tbl.ajax.reload(null, false);
        livewire.emit('refresh');
      }
    }
  });
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/purchase-medicine/purchase-medicine.js ***!
  \********************************************************************/
document.addEventListener('turbo:load', loadPurchaseMedicineCreate);
var uniquePrescriptionId = '';
function loadPurchaseMedicineCreate() {
  if (!$('#purchaseUniqueId').length) {
    return;
  }
  $('.purchaseMedicineExpiryDate').flatpickr({
    minDate: new Date(),
    dateFormat: 'Y-m-d'
  });
  $('#paymentMode').select2({
    width: '100%'
  });
}
listenClick('.add-medicine-btn-purchase', function () {
  uniquePrescriptionId = $('#purchaseUniqueId').val();
  var data = {
    'medicines': JSON.parse($('.associatePurchaseMedicines').val()),
    'uniqueId': uniquePrescriptionId
  };
  var prescriptionMedicineHtml = prepareTemplateRender('#purchaseMedicineTemplate', data);
  $('.prescription-medicine-container').append(prescriptionMedicineHtml);
  dropdownToSelecte2('.purchaseMedicineId');
  $('.purchaseMedicineExpiryDate').flatpickr({
    minDate: new Date(),
    dateFormat: 'Y-m-d'
  });
  uniquePrescriptionId++;
  $('#purchaseUniqueId').val(uniquePrescriptionId);
});
var dropdownToSelecte2 = function dropdownToSelecte2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.medicine_bills.select_medicine'),
    width: '100%'
  });
};
listenChange('.purchaseMedicineId', function () {
  var medicineId = $(this).val();
  var uniqueId = $(this).attr('data-id');
  var salePriceId = '#sale_price' + uniqueId;
  var buyPriceId = '#purchase_price' + uniqueId;
  if (medicineId == '') {
    $(salePriceId).val('0.00');
    $(buyPriceId).val('0.00');
    return false;
  }
  $.ajax({
    type: 'get',
    url: route('get-medicine', medicineId),
    success: function success(result) {
      $(salePriceId).val(result.data.selling_price.toFixed(2));
      $(buyPriceId).val(result.data.buying_price.toFixed(2));
    }
  });
});
listenKeyup('.purchase-quantity,.purchase-price,purchase-quantity,.purchase-tax,.purchase-discount', function () {
  var value = $(this).val();
  $(this).val(value.replace(/[^0-9\.]/g, ""));
  var currentRow = $(this).closest("tr");
  var currentqty = currentRow.find('.purchase-quantity').val();
  var price = currentRow.find('.purchase-price').val();
  var currentamount = parseFloat(price * currentqty);
  currentRow.find('.purchase-amount').val(currentamount.toFixed(2));
  var taxEle = $('.purchase-tax');
  var elements = $('.purchase-amount');
  var total = 0.00;
  var totalTax = 0;
  var netAmount = 0;
  var discount = 0;
  var amount = 0;
  for (var i = 0; i < elements.length; i++) {
    total += parseFloat(elements[i].value);
    discount = $('.purchase-discount').val();
    if (taxEle[i].value != 0 && taxEle[i].value != '') {
      if (taxEle[i].value > 99) {
        var taxAmount = taxEle[i].value.slice(0, -1);
        currentRow.find('.purchase-tax').val(taxAmount);
        displayErrorMessage(Lang.get('messages.new_change.tax_less_100'));
        $("#discountAmount").val(discount);
        return false;
      }
      totalTax += elements[i].value * taxEle[i].value / 100;
    } else {
      amount += parseFloat(elements[i].value);
    }
  }
  discount = discount == '' ? 0 : discount;
  netAmount = parseFloat(total) + parseFloat(totalTax);
  netAmount = parseFloat(netAmount) - parseFloat(discount);
  if (discount > total && $(this).hasClass('purchase-discount')) {
    discount = discount.slice(0, -1);
    displayErrorMessage(Lang.get('messages.new_change.discount_less_than_amount'));
    $("#discountAmount").val(discount);
    return false;
  }
  if (discount > total) {
    netAmount = 0;
  }
  $("#total").val(total.toFixed(2));
  $("#purchaseTaxId").val(totalTax.toFixed(2));
  $("#netAmount").val(netAmount.toFixed(2));
});
listenClick('.delete-purchase-medicine-item', function () {
  var currentRow = $(this).closest("tr");
  var currentRowAmount = currentRow.find('.purchase-amount').val();
  var currentRowTax = currentRow.find('.purchase-tax').val();
  var currentTaxAmount = parseFloat(currentRowAmount) * parseFloat(currentRowTax / 100);
  var updatedTax = parseFloat($('#purchaseTaxId').val()) - parseFloat(currentTaxAmount);
  $('#purchaseTaxId').val(updatedTax.toFixed(2));
  var updatedTotalAmount = parseFloat($('#total').val()) - parseFloat(currentRowAmount);
  $('#total').val(updatedTotalAmount.toFixed(2));
  var amountSubfromNetAmt = parseFloat(currentTaxAmount) + parseFloat(currentRowAmount);
  var updateNetAmount = parseFloat($('#netAmount').val()) - parseFloat(amountSubfromNetAmt);
  $('#netAmount').val(updateNetAmount.toFixed(2));
  $(this).parents('tr').remove();
});
listenSubmit('#purchaseMedicineFormId', function (e) {
  e.preventDefault();
  var y = $('#purchaseUniqueId').val() - 1;
  var tx = 1;
  for (var i = 1; i <= y; i++) {
    var medicinID = '#medicineChooseId' + i;
    var taxId = 'tax' + i;
    if (typeof $(taxId).val() != 'undefined') {
      if ($(taxId).val() == null || $(taxId).val() == '') {
        tx = 0;
      }
    }
    if (typeof $(medicinID).val() != 'undefined') {
      if ($(medicinID).val() == null || $(medicinID).val() == '') {
        displayErrorMessage(Lang.get('messages.medicine_bills.select_medicine'));
        return false;
      }
    }
    var lotNum = '#lot_no' + i;
    if (typeof $(lotNum).val() != 'undefined') {
      if ($(lotNum).val() == null || $(lotNum).val() == '') {
        displayErrorMessage(Lang.get('messages.new_change.enter_lot_no'));
        return false;
      }
    }
    var salePrice = '#sale_price' + i;
    if (typeof $(salePrice).val() != 'undefined') {
      if ($(salePrice).val() == null || $(salePrice).val() == '') {
        displayErrorMessage(Lang.get('messages.new_change.enter_sale_price'));
        return false;
      }
    }
    var purchasePrice = '#purchase_price' + i;
    if (typeof $(purchasePrice).val() != 'undefined') {
      if ($(purchasePrice).val() == null || $(purchasePrice).val() == '') {
        displayErrorMessage(Lang.get('messages.new_change.enter_purchase_price'));
        return false;
      } else if ($(purchasePrice).val() == 0) {
        displayErrorMessage(Lang.get('messages.new_change.quantity_greater_than_0'));
        return false;
      }
    }
    var quantityID = '#quantity' + i;
    if (typeof $(quantityID).val() != 'undefined') {
      if ($(quantityID).val() == null || $(quantityID).val() == '') {
        displayErrorMessage(Lang.get('messages.new_change.enter_quantity'));
        return false;
      } else if ($(quantityID).val() == 0) {
        displayErrorMessage(Lang.get('messages.new_change.quantity_greater_than_0'));
        return false;
      }
    }
  }
  var netAmount = '#netAmount';
  if ($(netAmount).val() == null || $(netAmount).val() == '') {
    displayErrorMessage(Lang.get('messages.medicine_bills.net_amount_not_empty'));
    return false;
  } else if ($(netAmount).val() == 0) {
    displayErrorMessage(Lang.get('messages.medicine_bills.net_amount_not_zero'));
    return false;
  }
  if (tx == 0 && ($('#purchaseTaxId').val() == null || $('#purchaseTaxId').val() == '')) {
    displayErrorMessage(Lang.get('messages.new_change.tax_not_empty'));
    return false;
  }
  $(this)[0].submit();
});
listenClick('.purchaseMedicineDelete', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem(route('medicine-purchase.destroy', id), '', Lang.get('messages.purchase_medicine.purchase_medicine'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/medicine-bills/medicine-bills.js ***!
  \**************************************************************/
document.addEventListener("turbo:load", loadSaleMedicineCreate);
var uniquePrescriptionId = "";
Lang.setLocale(UserCurrentLang);
function loadSaleMedicineCreate() {
  if (!$("#medicineUniqueId").length) {
    return;
  }
  $(".medicine_bill_date").flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: "Y-m-d H:i"
  });
  $(".edit_medicine_bill_date").flatpickr({
    enableTime: true,
    dateFormat: "Y-m-d H:i"
  });
  $(".medicineBillExpiryDate").flatpickr({
    minDate: new Date(),
    dateFormat: "Y-m-d"
  });
  $(".medicine-payment-mode").select2({
    width: "100%"
  });
  $(".medicineBillCategoriesId").select2({
    width: "100%"
  });
}
listenChange(".medicineBillCategoriesId", function () {
  var categoryId = $(this).val();
  var uniqueId = $(this).attr("data-id");
  var currentRow = $(this).closest("tr");
  var medicineId = currentRow.find('.purchaseMedicineId');
  var availableQuantity = "#medicineAvailableQuantity" + uniqueId;
  if (categoryId == "") {
    $(medicineId).find("option").remove();
    $(medicineId).append($("<option></option>").attr("placeholder", "").text(Lang.get("messages.medicine_bills.select_medicine")));
    $("#medicine_sale_price" + uniqueId).val("0.00");
    currentRow.find("#medicineAvailableQuantity" + uniqueId).text("0");
    return false;
  }
  $.ajax({
    type: "get",
    url: route("get-medicine-category", categoryId),
    success: function success(result) {
      if (result.data.medicine.length == 0) {
        currentRow.find("#medicineAvailableQuantity" + uniqueId).text("0");
      }
      var array = result.data.medicine;
      $(medicineId).find("option").remove();
      $(medicineId).attr("required", true);
      $("#medicine_sale_price" + uniqueId).val("0.00");
      currentRow.find("#medicineAvailableQuantity" + uniqueId).text("0");
      $(medicineId).append($('<option value="">' + Lang.get('messages.medicine_bills.select_medicine') + '</option>'));
      $.each(array, function (key, value) {
        $(medicineId).append($('<option></option>').attr('value', key).text(value));
      });
    }
  });
});
listenChange(".medicinePurchaseId", function () {
  var currentRow = $(this).closest("tr");
  var medicineId = $(this).val();
  var uniqueId = $(this).attr("data-id");
  var salePriceId = "#medicine_sale_price" + uniqueId;
  var availableQuantity = "#medicineAvailableQuantity" + uniqueId;
  if (medicineId == "" || medicineId == Lang.get("messages.medicine_bills.select_medicine")) {
    $(salePriceId).val("0.00");
    $(availableQuantity).text("0");
    return false;
  }
  $.ajax({
    type: "get",
    url: route("get-medicine", medicineId),
    success: function success(result) {
      $(availableQuantity).text(result.data.available_quantity);
      $(salePriceId).val(result.data.selling_price.toFixed(2));
      var currentqty = currentRow.find(".medicineBill-quantity").val();
      var price = currentRow.find(".medicineBill-sale-price").val();
      var currentamount = parseFloat(price * currentqty);
      currentRow.find(".medicine-bill-amount").val(currentamount.toFixed(2));
      var taxEle = $(".medicineBill-tax");
      var elements = $(".medicine-bill-amount");
      var total = 0.0;
      var totalTax = 0;
      var netAmount = 0;
      var discount = 0;
      var amount = 0;
      for (var i = 0; i < elements.length; i++) {
        total += parseFloat(elements[i].value);
        discount = $(".medicineBill-discount").val();
        if (taxEle[i].value != 0 && taxEle[i].value != "") {
          totalTax += elements[i].value * taxEle[i].value / 100;
        } else {
          amount += parseFloat(elements[i].value);
        }
      }
      discount = discount == "" ? 0 : discount;
      netAmount = parseFloat(total) + parseFloat(totalTax);
      netAmount = parseFloat(netAmount) - parseFloat(discount);
      if (discount > total && $(this).hasClass("medicineBill-discount")) {
        discount = discount.slice(0, -1);
        displayErrorMessage(Lang.get('messages.new_change.discount_less_than_amount'));
        $("#discountAmount").val(discount);
        return false;
      }
      if (discount > total) {
        netAmount = 0;
      }
      $("#total").val(total.toFixed(2));
      $("#medicineTotalTaxId").val(totalTax.toFixed(2));
      $("#netAmount").val(netAmount.toFixed(2));
    }
  });
});
listenClick(".add-medicine-btn-medicine-bill", function () {
  uniquePrescriptionId = $("#medicineUniqueId").val();
  var data = {
    medicinesCategories: JSON.parse($("#showMedicineCategoriesMedicineBill").val()),
    medicines: JSON.parse($(".associatePurchaseMedicines").val()),
    uniqueId: uniquePrescriptionId
  };
  var prescriptionMedicineHtml = prepareTemplateRender("#medicineBillTemplate", data);
  $(".medicine-bill-container").append(prescriptionMedicineHtml);
  dropdownToSelecte2(".medicinePurchaseId");
  dropdownToSelecteCategories2(".medicinebillCategories");
  expiryDateFlatePicker(".medicinebillCategories");
  $(".purchaseMedicineExpiryDate").flatpickr({
    minDate: new Date(),
    dateFormat: "Y-m-d"
  });
  uniquePrescriptionId++;
  $("#medicineUniqueId").val(uniquePrescriptionId);
});
var dropdownToSelecte2 = function dropdownToSelecte2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.medicine_bills.select_medicine'),
    width: "100%"
  });
};
var dropdownToSelecteCategories2 = function dropdownToSelecteCategories2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.medicine.select_category'),
    width: "100%"
  });
};
var expiryDateFlatePicker = function expiryDateFlatePicker(selector) {
  $(".medicineBillExpiryDate").flatpickr({
    minDate: new Date(),
    dateFormat: "Y-m-d"
  });
};
listenKeyup(".medicineBill-quantity,.medicineBill-price,.medicineBill-tax,.medicineBill-discount,.medicineBill-sale-price", function () {
  var value = $(this).val();
  $(this).val(value.replace(/[^0-9\.]/g, ""));
  var currentRow = $(this).closest("tr");
  var currentqty = currentRow.find(".medicineBill-quantity").val();
  var price = currentRow.find(".medicineBill-sale-price").val();
  var currentamount = parseFloat(price * currentqty);
  currentRow.find(".medicine-bill-amount").val(currentamount.toFixed(2));
  var taxEle = $(".medicineBill-tax");
  var elements = $(".medicine-bill-amount");
  var total = 0.0;
  var totalTax = 0;
  var netAmount = 0;
  var discount = 0;
  var amount = 0;
  var qty = $(".medicineBill-quantity");
  var PreviousQty = $(".previous-quantity");
  for (var i = 0; i < elements.length; i++) {
    total += parseFloat(elements[i].value);
    discount = $(".medicineBill-discount").val();
    if ($("#medicineBillStatus").val() == 1) {
      if (parseInt(qty[i].value) > parseInt(PreviousQty[i].value)) {
        var qtyRollback = qty[i].value.slice(0, -1);
        currentRow.find(".medicineBill-quantity").val(qtyRollback);
        currentqty = currentRow.find(".medicineBill-quantity").val();
        price = currentRow.find(".medicineBill-sale-price").val();
        currentamount = parseFloat(price * currentqty);
        currentRow.find(".medicine-bill-amount").val(currentamount.toFixed(2));
        displayErrorMessage(Lang.get("messages.medicine_bills.update_quantity"));
        return false;
      }
    }
    if (taxEle[i].value != 0 && taxEle[i].value != "") {
      if (taxEle[i].value > 99) {
        var taxAmount = taxEle[i].value.slice(0, -1);
        currentRow.find(".medicineBill-tax").val(taxAmount);
        displayErrorMessage(Lang.get('messages.new_change.tax_less_100'));
        $("#discountAmount").val(discount);
        return false;
      }
      totalTax += elements[i].value * taxEle[i].value / 100;
    } else {
      amount += parseFloat(elements[i].value);
    }
  }
  discount = discount == "" ? 0 : discount;
  netAmount = parseFloat(total) + parseFloat(totalTax);
  netAmount = parseFloat(netAmount) - parseFloat(discount);
  if (discount > total && $(this).hasClass("medicineBill-discount")) {
    discount = discount.slice(0, -1);
    displayErrorMessage(Lang.get('messages.new_change.discount_less_than_amount'));
    $("#discountAmount").val(discount);
    return false;
  }
  if (discount > total) {
    netAmount = 0;
  }
  $("#total").val(total.toFixed(2));
  $("#medicineTotalTaxId").val(totalTax.toFixed(2));
  $("#netAmount").val(netAmount.toFixed(2));
});
listenSubmit("#CreateMedicineBillForm", function (e) {
  e.preventDefault();
  var netAmount = "#netAmount";
  if ($("#total").val() < $("#discountAmount").val()) {
    displayErrorMessage(Lang.get('messages.new_change.discount_less_than_amount'));
    return false;
  } else if ($(netAmount).val() == null || $(netAmount).val() == "") {
    displayErrorMessage(Lang.get("messages.medicine_bills.net_amount_not_empty"));
    return false;
  } else if ($(netAmount).val() == 0) {
    displayErrorMessage(Lang.get("messages.medicine_bills.net_amount_not_zero"));
    return false;
  } else if ($(".medicineBill-quantity").val() == 0 || $(".medicineBill-quantity").val() == null || $(".medicineBill-quantity").val() == "") {
    displayErrorMessage(Lang.get('messages.new_change.quantity_not_empty'));
    return false;
  }
  $(this)[0].submit();
});
listenClick(".add-patient-modal", function () {
  $("#addPatientModal").appendTo("body").modal("show");
});
listenSubmit("#addPatientForm", function (e) {
  e.preventDefault();
  processingBtn("#addPatientForm", "#patientBtnSave", "loading");
  $("#patientBtnSave").attr("disabled", true);
  $.ajax({
    url: route("store.patient"),
    type: "POST",
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        $("#prescriptionPatientId").find("option").remove();
        $("#prescriptionPatientId").append($("<option></option>").attr("placeholder", "").text(Lang.get("messages.document.select_patient")));
        $.each(result.data, function (i, v) {
          $("#prescriptionPatientId").append($("<option></option>").attr("value", i).text(v));
        });
        displaySuccessMessage(result.message);
        $("#addPatientModal").modal("hide");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      $("#patientBtnSave").attr("disabled", false);
      processingBtn("#addPatientForm", "#patientBtnSave");
    }
  });
});
listenHiddenBsModal("#addPatientModal", function () {
  resetModalForm("#addPatientForm", "#patientErrorsBox");
});
listenClick(".medicine-bill-delete-btn", function (event) {
  var id = $(event.currentTarget).attr("data-id");
  deleteItem(route("medicine-bills.destroy", id), "", Lang.get("messages.medicine_bills.medicine_bill"));
});
listenSubmit("#MedicinebillForm", function (e) {
  e.preventDefault();
  var netAmount = "#netAmount";
  if (parseFloat($("#total").val()) < parseFloat($("#discountAmount").val())) {
    displayErrorMessage(Lang.get('messages.new_change.discount_less_than_amount'));
    return false;
  } else if ($(netAmount).val() == null || $(netAmount).val() == "") {
    displayErrorMessage(Lang.get("messages.medicine_bills.net_amount_not_empty"));
    return false;
  } else if ($(netAmount).val() == 0) {
    displayErrorMessage(Lang.get("messages.medicine_bills.net_amount_not_zero"));
    return false;
  } else if ($(".medicineBill-quantity").val() == 0 || $(".medicineBill-quantity").val() == null || $(".medicineBill-quantity").val() == "") {
    displayErrorMessage(Lang.get('messages.new_change.quantity_not_empty'));
    return false;
  }
  $medicineBillId = $("#medicineBillId").val();
  $.ajax({
    url: route("medicine-bills.update", $medicineBillId),
    type: "post",
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        setTimeout(function () {
          Turbo.visit(route("medicine-bills.index")); // true
        }, 2000);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick(".delete-medicine-bill-item", function () {
  var currentRow = $(this).closest("tr");
  var currentRowAmount = currentRow.find(".medicine-bill-amount").val();
  var currentRowTax = currentRow.find(".medicineBill-tax").val();
  var currentTaxAmount = parseFloat(currentRowAmount) * parseFloat(currentRowTax / 100);
  var updatedTax = parseFloat($("#medicineTotalTaxId").val()) - parseFloat(currentTaxAmount);
  $("#medicineTotalTaxId").val(updatedTax.toFixed(2));
  var updatedTotalAmount = parseFloat($("#total").val()) - parseFloat(currentRowAmount);
  $("#total").val(updatedTotalAmount.toFixed(2));
  var amountSubfromNetAmt = parseFloat(currentTaxAmount) + parseFloat(currentRowAmount);
  var updateNetAmount = parseFloat($("#netAmount").val()) - parseFloat(amountSubfromNetAmt);
  $("#netAmount").val(updateNetAmount.toFixed(2));
  $(this).parents("tr").remove();
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/beds/beds_assigns_view_list.js ***!
  \************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************!*\
  !*** ./resources/assets/js/beds/bulk_beds.js ***!
  \***********************************************/


document.addEventListener('turbo:load', loadBedsBulkCreate);
function loadBedsBulkCreate() {
  if (!$('#bulkBedsForm').length) {
    return false;
  }
  dropdownToSelect2('.bedType');
}
function dropdownToSelect2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.bed.select_bed_type'),
    width: '100%'
  });
}
listenClick('#addNewBedItem', function () {
  var uniqueId = $('#uniqueId').val();
  var data = {
    'bedTypes': JSON.parse($('#bedTypes').val()),
    'uniqueId': uniqueId
  };
  var bulkBedItemHtml = prepareTemplateRender('#bulkBedActionTemplate', data);
  $('.bulk-beds-item-container').append(bulkBedItemHtml);
  dropdownToSelect2('.bedType');
  uniqueId++;
  $('#uniqueId').val(uniqueId);
  resetBulkBedItemIndex();
});
function resetBulkBedItemIndex() {
  var index = 1;
  $('.bulk-beds-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    var uniqueId = $('#uniqueId').val();
    var data = {
      'services': JSON.parse($('#bedTypes').val()),
      'uniqueId': uniqueId
    };
    var bulkBedItemHtml = prepareTemplateRender('#bulkBedActionTemplate', data);
    $('.bulk-beds-item-container').append(bulkBedItemHtml);
    dropdownToSelect2('.bedType');
    uniqueId++;
  }
}
listenClick('.delete-invoice-item', function () {
  $(this).parents('tr').remove();
  resetBulkBedItemIndex();
});
listenSubmit('#bulkBedsForm', function (event) {
  event.preventDefault();
  // screenLock();
  $('.bulk-button').prop('disabled', true);
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#bulkBedSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      $('.bulk-button').prop('disabled', false);
      window.location.href = $('#bulkBedUrl').val();
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('.bulk-button').prop('disabled', false);
    }
    // complete: function () {
    //     screenUnLock();
    // },
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************************************!*\
  !*** ./resources/assets/js/beds/create-edit.js ***!
  \*************************************************/


document.addEventListener('turbo:load', loadBedsCreateEDit);
function loadBedsCreateEDit() {
  if (!$('#addNewBedsForm').length && !$('#EditBedsForm').length) {
    return false;
  }
  var editBedTypeElement = $('#editBedType');
  if (editBedTypeElement.length) {
    $('#editBedType').select2({
      width: '100%',
      dropdownParent: $('#edit_beds_modal')
    });
  }
}
listenSubmit('#addNewBedsForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#BedSaveBtn');
  loadingButton.button('loading');
  $.ajax({
    url: $('#bedCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_beds_modal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.bed-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bedId = $(event.currentTarget).data('id');
  renderBedData(bedId);
});
function renderBedData(id) {
  $.ajax({
    url: $('.bedUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#bedId').val(result.data.id);
        $('#editBedName').val(result.data.name);
        $('#editBedType').val(result.data.bed_type).trigger('change.select2');
        $('#editBedDescription').val(result.data.description);
        $('#editBedCharge').val(result.data.charge);
        $('.price-input').trigger('input');
        $('#edit_beds_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#EditBedsForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditSave');
  loadingButton.button('loading');
  var id = $('#bedId').val();
  $.ajax({
    url: $('.bedUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_beds_modal').modal('hide');
        if ($('#bedDetailShowUrl').length) {
          window.location.href = $('#bedDetailShowUrl').val();
        } else {
          livewire.emit('refresh');
        }
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_beds_modal', function () {
  resetModalForm('#addNewBedsForm', '#validationErrorsBox');
  $('#bedType').trigger('change.select2');
});
listenHiddenBsModal('#edit_beds_modal', function () {
  resetModalForm('#EditBedsForm', '#editValidationErrorsBox');
});
listenShownBsModal('#add_beds_modal', function () {
  $('#bedType').select2({
    width: '100%',
    dropdownParent: $('#add_beds_modal')
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/medicines/medicines.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadMedicineCreateEditData);
function loadMedicineCreateEditData() {
  $('#categoryId, #brandId').select2({
    width: '100%'
  });
}
listenClick('.deleteMedicineBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  medicineDeleteItem(route("check.use.medicine", id), '#tblMedicines', $('#medicineLang').val());
});
listenClick('.showMedicineBtn', function (event) {
  event.preventDefault();
  var medicineId = $(event.currentTarget).attr('data-id');
  renderMedicineData(medicineId);
});
function renderMedicineData(id) {
  $.ajax({
    url: $('#medicinesShowModal').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showMedicineName').text(result.data.name);
        $('#showMedicineBrand').text(result.data.brand.name);
        $('#showMedicineCategory').text(result.data.category.name);
        $('#showMedicineSaltComposition').text(result.data.salt_composition);
        $('#showMedicineSellingPrice').text($('.currentCurrency').val() + ' ' + addCommas(result.data.selling_price));
        $('#showMedicineBuyingPrice').text($('.currentCurrency').val() + ' ' + addCommas(result.data.buying_price));
        $('#showMedicineQuanity').text(addCommas(result.data.quantity));
        $('#showMedicineAvailableQuanity').text(addCommas(result.data.available_quantity));
        $('#showMedicineSideEffects').text(result.data.side_effects);
        $('#showMedicineCreatedOn').text(moment(result.data.created_at).fromNow());
        $('#showMedicineUpdatedOn').text(moment(result.data.updated_at).fromNow());
        $('#showMedicineDescription').text(result.data.description);
        setValueOfEmptySpan();
        $('#showMedicine').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
window.medicineDeleteItem = function (url) {
  var tableId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var header = arguments.length > 2 ? arguments[2] : undefined;
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  $.ajax({
    url: url,
    type: "GET",
    success: function success(result) {
      if (result.success) {
        var popUpText = result.data.result == true ? Lang.get('messages.new_change.medicine_bill_already_use') : $('.confirmVariable').val() + header + '?';
        swal({
          title: $('.deleteVariable').val() + '!',
          text: popUpText,
          icon: sweetAlertIcon,
          buttons: {
            confirm: $('.yesVariable').val() + ',' + $('.deleteVariable').val(),
            cancel: $('.noVariable').val() + ',' + $('.cancelVariable').val()
          }
        }).then(function (popResult) {
          if (popResult) {
            deleteMedicineAjax($('#indexMedicineUrl').val() + '/' + result.data.id, tableId = null, header, callFunction = null);
          }
        });
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
function deleteMedicineAjax(url) {
  var tableId = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  var header = arguments.length > 2 ? arguments[2] : undefined;
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  $.ajax({
    url: url,
    type: 'DELETE',
    dataType: 'json',
    success: function success(obj) {
      if (obj.success && obj.data) {
        swal({
          title: obj.message,
          text: $('.confirmVariable').val() + header + '?',
          icon: sweetAlertIcon,
          timer: 3000,
          buttons: {
            confirm: $('.yesVariable').val() + ',' + $('.deleteVariable').val(),
            cancel: $('.noVariable').val() + ',' + $('.cancelVariable').val()
          }
        }).then(function (result) {
          if (result) {
            $.ajax({
              url: url,
              type: 'DELETE',
              dataType: 'json',
              data: {
                canDeleteCheck: 'yes'
              },
              success: function success(obj) {},
              error: function error(data) {
                swal({
                  title: '',
                  text: data.responseJSON.message,
                  confirmButtonColor: '#009ef7',
                  icon: 'error',
                  timer: 5000,
                  buttons: {
                    confirm: $('.okVariable').val()
                  }
                });
              }
            });
          }
        });
      }
      if (obj.success && !obj.data) {
        Livewire.emit('resetPage');
        swal({
          icon: 'success',
          title: $('.deletedVariable').val(),
          confirmButtonColor: '#f62947',
          text: header + ' ' + $('.hasBeenDeletedVariable').val(),
          timer: 2000,
          buttons: {
            confirm: $('.okVariable').val()
          }
        });
        if (callFunction) {
          eval(callFunction);
        }
      }
    },
    error: function error(data) {
      swal({
        title: '',
        text: data.responseJSON.message,
        confirmButtonColor: '#009ef7',
        icon: 'error',
        timer: 5000,
        buttons: {
          confirm: $('.okVariable').val()
        }
      });
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************!*\
  !*** ./resources/assets/js/medicines/new.js ***!
  \**********************************************/


$(document).ready(function () {
  var qtyEle = $('#qty');
  qtyEle.blur(function () {
    if (qtyEle.val() < 0) {
      qtyEle.val(0);
    }
  });
  $('#brandId,#categoryId').select2({
    width: '100%'
  });
  $('#medicineNameId').focus();
  $('#createMedicine, #editMedicine').on('submit', function () {
    $('#saveBtn').attr('disabled', true);
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/document_type/doc_type.js ***!
  \*******************************************************/
listenSubmit('#addDocTypeForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#docTypeSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#indexDocTypeCreateUrl').val(),
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  newRecord(data, loadingButton, '#add_document_types_modal');
});
listenClick('.editDocTypBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var docTypeId = $(event.currentTarget).attr('data-id');
  renderDocTypeData(docTypeId);
});
function renderDocTypeData(id) {
  $.ajax({
    url: $('#indexDocTypeUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#docTypeId').val(result.data.id);
        $('#editDocTypeName').val(result.data.name);
        $('#edit_document_types_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editDocTypForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editDocTypeSave');
  loadingButton.button('loading');
  var id = $('#docTypeId').val();
  var url = $('.docTypeUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'PUT'
    // 'tableSelector': tableName,
  };
  editRecordWithForm(data, loadingButton, '#edit_document_types_modal');
});
listenClick('.deleteDocTypeBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexDocTypeUrl').val() + '/' + id, '#tblDocTypes', $('#documentTypeLang').val());
});
listenHiddenBsModal('#add_document_types_modal', function () {
  resetModalForm('#addDocTypeForm', '#docTypeErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/assets/js/document/document.js ***!
  \**************************************************/


document.addEventListener('turbo:load', loadDocumentCreateEdit);
function loadDocumentCreateEdit() {
  if (!$('#addDocumentForm').length && !$('#editDocumentForm').length) {
    return false;
  }
  var documentPatientIdElement = $('#documentPatientId');
  var documentTypeIdElement = $('#documentTypeId');
  var editDocumentPatientIdElement = $('#editDocumentPatientId');
  var editDocumentTypeIdElement = $('#editDocumentTypeId');
  if (documentPatientIdElement.length) {
    $('#documentPatientId').select2({
      width: '100%',
      dropdownParent: $('#add_documents_modal')
    });
  }
  if (documentTypeIdElement.length) {
    $('#documentTypeId').select2({
      width: '100%',
      dropdownParent: $('#add_documents_modal')
    });
  }
  if (editDocumentPatientIdElement.length) {
    $('#editDocumentPatientId').select2({
      width: '100%',
      dropdownParent: $('#edit_documents_modal')
    });
  }
  if (editDocumentTypeIdElement.length) {
    $('#editDocumentTypeId').select2({
      width: '100%',
      dropdownParent: $('#edit_documents_modal')
    });
  }
}
listenClick('.document-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexDocumentsUrl').val() + '/' + id, '', $('#documentLang').val());
});
var documentFileName;
listenChange('#documentImage,#editDocumentImage', function () {
  documentFileName = $(this).val();
});
listenSubmit('#addDocumentForm', function (event) {
  event.preventDefault();
  // if (documentFileName == null || documentFileName == '') {
  //     let message = 'Please select attachment';
  //     displayErrorMessage(message);
  //     return false;
  // }
  if ($('#documentErrorsBox').text() !== '') {
    $('#documentImage').focus();
    return false;
  }
  var loadingButton = jQuery(this).find('#documentSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#indexDocumentsCreateUrl').val(),
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  newRecord(data, loadingButton, '#add_documents_modal');
});
listenClick('.document-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var documentId = $(event.currentTarget).attr('data-id');
  renderDocumentData(documentId);
});
function renderDocumentData(id) {
  $.ajax({
    url: $('#indexDocumentsUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          $('#editDocumentPreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editDocumentPreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else {
          $('#editDocumentPreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
        }
        $('#editDocumentTypeId').val(result.data.document_type_id).trigger('change.select2');
        $('#editDocumentPatientId').val(result.data.patient_id).trigger('change.select2');
        $('#editDocumentTitle').val(result.data.title);
        isEmpty(result.data.document_url) ? $('#editDocumentUrl').hide() : $('#editDocumentUrl').attr('href', result.data.document_url);
        $('#documentId').val(result.data.id);
        $('#editDocumentNotes').val(result.data.notes);
        $('#edit_documents_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editDocumentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editDocumentSave');
  loadingButton.button('loading');
  var id = $('#documentId').val();
  var url = $('#indexDocumentsUrl').val() + '/' + id + '/update';
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  editRecord(data, loadingButton, '#edit_documents_modal');
});
listenHiddenBsModal('#add_documents_modal', function () {
  $('#documentTypeId').val(null).trigger('change');
  $('#documentPatientId').val(null).trigger('change');
  $('#documentPreviewImage').css('background-image', 'url(' + $('#indexDefaultDocumentImageUrl').val() + ')');
  documentFileName = null;
  resetModalForm('#addDocumentForm', '#documentErrorsBox');
});
listenHiddenBsModal('#edit_documents_modal', function () {
  resetModalForm('#editDocumentForm', '#editDocumentErrorsBox');
});
listenShownBsModal('#add_documents_modal,#edit_documents_modal', function () {
  $('#documentTypeId,#documentPatientId').select2({
    width: '100%',
    dropdownParent: $('#add_documents_modal')
  });
  $('#editDocumentTypeId,#editDocumentPatientId').select2({
    width: '100%',
    dropdownParent: $('#edit_documents_modal')
  });
});
listenChange('#documentImages', function () {
  var extension = isValidDocument($(this), '#documentErrorsBox', this);
  if (!isEmpty(extension) && extension != false) {
    $('#documentErrorsBox').html('').hide();
    displayDocument(this, '#documentPreviewImage', extension);
  }
});
listenChange('#editDocumentImages', function () {
  var extension = isValidDocument($(this), '#editDocumentErrorsBox', this);
  if (!isEmpty(extension) && extension != false) {
    $('#editDocumentErrorsBox').html('').hide();
    displayDocument(this, '#editPreviewImage', extension);
  }
});
function isValidDocument(inputSelector, validationMessageSelector, input) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if (input.files[0].size > 10000000) {
    $(inputSelector).val('');
    $(validationMessageSelector).html('The document must be less than 10 mb').show();
    setTimeout(function () {
      $(validationMessageSelector).slideUp(500);
    }, 5000);
    return false;
  }
  Lang.setLocale($('.userCurrentLanguage').val());
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx', 'mp3', 'mp4']) == -1) {
    // $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.document.document_file_size')).show();
    setTimeout(function () {
      $(validationMessageSelector).slideUp(500);
    }, 5000);
    // return false;
  }
  return ext;
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************!*\
  !*** ./resources/assets/js/document_type/user_documents.js ***!
  \*************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/notice_boards/notice_boards.js ***!
  \************************************************************/
listen('click', '.notice-board-delete-btn', function (event) {
  var noticeBoardId = $(event.currentTarget).attr('data-id');
  deleteItem($('.indexNoticeBoardUrl').val() + '/' + noticeBoardId, '', $('#noticeBoardLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/notice_boards/create-edit.js ***!
  \**********************************************************/


listenSubmit('#addNoticeBoardForm', function (event) {
  event.preventDefault();
  $('#noticeBoardSave').attr('disabled', true);
  $.ajax({
    url: $('#indexNoticeBoardCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_notice_boards_modal').modal('hide');
        // $('#noticeBoardsTable').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
        $('#noticeBoardSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#noticeBoardErrorsBox', result);
      $('#noticeBoardSave').attr('disabled', false);
    }
  });
});
listen('click', '.notice-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var noticeBoardId = $(event.currentTarget).attr('data-id');
  renderNoticeBoardUpdateData(noticeBoardId);
});
listen('click', '.notice-view-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var noticeBoardId = event.currentTarget.dataset.id;
  $.ajax({
    url: $('.indexNoticeBoardUrl').val() + '/' + noticeBoardId,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showNoticeBoardTitle').html('');
        $('#showNoticeBoardDescription').html('');
        $('#showNoticeBoardTitle').append(result.data.title);
        $('#showNoticeBoardDescription').append(result.data.description);
        $('#show_notice_boards_modal').appendTo('body').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
function renderNoticeBoardUpdateData(id) {
  $.ajax({
    url: $('.indexNoticeBoardUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#noticeBoardId').val(result.data.id);
        $('#editNoticeBoardTitle').val(result.data.title);
        $('#editNoticeBoardDescription').val(result.data.description);
        $('#edit_notice_boards_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
listenSubmit('#editNoticeBoardsForm', function (event) {
  event.preventDefault();
  $('#noticeBoardSave').attr('disabled', true);
  var id = $('#noticeBoardId').val();
  $.ajax({
    url: $('.indexNoticeBoardUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_notice_boards_modal').modal('hide');
        // $('#noticeBoardsTable').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
        $('#noticeBoardSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#noticeBoardSave').attr('disabled', false);
    }
  });
});
listenHiddenBsModal('#add_notice_boards_modal', function () {
  resetModalForm('#addNoticeBoardForm', '#noticeBoardErrorsBox');
  $('#noticeBoardSave').attr('disabled', false);
});
listenHiddenBsModal('#edit_notice_boards_modal', function () {
  resetModalForm('#editNoticeBoardsForm', '#editNoticeBoardErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************************!*\
  !*** ./resources/assets/js/bed_assign/bed_assign.js ***!
  \******************************************************/


listenClick('.bed-assign-delete-btn', function (event) {
  var bedAssignId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bedAssignUrl').val() + '/' + bedAssignId, '#bedAssignsTbl', $('#bedAssignLang').val());
});
listenChange('.bed-assign-status', function (event) {
  var bedAssignId = $(event.currentTarget).attr('data-id');
  updateBedAssignStatus(bedAssignId);
});
listen('click', '#bedAssignResetFilter', function () {
  $('#bed_assign_filter_status').val(0).trigger('change');
  hideDropdownManually($('#bedAssignFilterBtn'), $('.dropdown-menu'));
});
listenChange('#bed_assign_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  hideDropdownManually($('#bedAssignFilterBtn'), $('#bedAssignFilterDiv'));
});
function updateBedAssignStatus(id) {
  $.ajax({
    url: $('#bedAssignUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        Livewire.emit('refresh');
      }
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/bed_assign/create-edit.js ***!
  \*******************************************************/
document.addEventListener('turbo:load', loadBedAssignCreateEdit);
function loadBedAssignCreateEdit() {
  var _$$val;
  if ($('#createBedAssign').length || $('#editBedAssign').length) {
    var caseIdElement = $('#caseId');
    var BedAssignBedIdElement = $('#BedAssignBedId');
    var ipdPatientIdElement = $('#ipdPatientId');
    if (caseIdElement.length) {
      $('#caseId').select2({
        width: '100%'
      });
      $('#caseId').first().focus();
    }
    if (BedAssignBedIdElement.length) {
      $('#BedAssignBedId').select2({
        width: '100%'
      });
    }
    if (ipdPatientIdElement.length) {
      $('#ipdPatientId').select2({
        placeholder: Lang.get('messages.new_change.select_ipd_patient'),
        width: '100%'
      });
    }
  } else {
    return false;
  }
  $('#BedAssignDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    minDate: new Date(),
    locale: $('.userCurrentLanguage').val(),
    onChange: function onChange(selectedDates, dateStr, instance) {
      var minDate = moment($('#assignDate').val()).add(1, 'days').format();
      if (typeof dischargeFlatPicker != 'undefined') {
        dischargeFlatPicker.set('minDate', minDate);
      }
    }
  });
  var startDate = ((_$$val = $('#editBedAssignDate').val()) === null || _$$val === void 0 ? void 0 : _$$val.split(' ')[0]) || [];
  $('#editBedAssignDate').flatpickr({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    defaultDate: $(this).val(),
    enable: [{
      from: startDate,
      to: new Date()
    }],
    locale: $('.userCurrentLanguage').val(),
    onChange: function onChange(selectedDates, dateStr, instance) {
      var minDate = moment($('#assignDate').val()).add(1, 'days').format();
      if (typeof dischargeFlatPicker != 'undefined') {
        dischargeFlatPicker.set('minDate', minDate);
      }
    }
  });
  if ($('#editBedAssign').length) {
    setTimeout(function () {
      $('#caseId').trigger('change');
      $('#BedAssignDate').trigger('dp.change');
    }, 300);
    var _dischargeFlatPicker = $('#BedAssignDischargeDate').flatpickr({
      enableTime: true,
      dateFormat: 'Y-m-d H:i',
      locale: $('.userCurrentLanguage').val()
    });
    var minDate = moment($('#BedAssignDate').val()).add(1, 'days').format();
    _dischargeFlatPicker.set('minDate', minDate);
  }
  var dischargeFlatPicker = undefined;
}
listenSubmit('#createBedAssign, #editBedAssign', function () {
  $('#saveBtn').attr('disabled', true);
  if ($('#validationErrorsBox').text() !== '') {
    $('#BedAssignSaveBtn').attr('disabled', false);
  }
});
listenChange('#caseId', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#ipdPatientListUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#ipdPatientId').empty();
          $('#ipdPatientId').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('#ipdPatientId').append($('<option></option>').attr('value', i).text(v));
          });
        } else {
          $('#ipdPatientId').prop('disabled', true);
        }
      }
    });
  }
  $('#ipdPatientId').empty();
  $('#ipdPatientId').append('<option>' + Lang.get('messages.new_change.no_ipd_patient_found') + '</option>');
  $('#ipdPatientId').prop('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************!*\
  !*** ./resources/assets/js/death_reports/death_reports.js ***!
  \************************************************************/


listenClick('.delete-death-report-btn', function (event) {
  var deathReportId = $(event.currentTarget).attr('data-id');
  deleteItem($('.deathReportUrl').val() + '/' + deathReportId, '#deathReportsTbl', $('#deathReportLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/death_reports/create-edit.js ***!
  \**********************************************************/


document.addEventListener('turbo:load', loadDeathReportData);
function loadDeathReportData() {
  $('#deathCaseId, #deathDoctorId').select2({
    width: '100%',
    dropdownParent: $('#addDeathReportModal')
  });
  $('#editDeathCaseId, #editDeathDoctorId').select2({
    width: '100%',
    dropdownParent: $('#editDeathReportModal')
  });
  $('#deathDate, #editDeathDate').flatpickr({
    dateFormat: 'Y-m-d h:i K',
    useCurrent: true,
    enableTime: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#addDeathReportNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnDRSave');
  loadingButton.button('loading');
  $('#btnDRSave').attr('disabled', true);
  $.ajax({
    url: route('death-reports.store'),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addDeathReportModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#deathReportsTbl').DataTable().ajax.reload(null, false);
        $('#btnDRSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#btnDRSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.edit-death-report-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var deathReportId = $(event.currentTarget).attr('data-id');
  renderDeathReportData(deathReportId);
});
window.renderDeathReportData = function (id) {
  $.ajax({
    url: $('.deathReportUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#deathReportId').val(result.data.id);
        $('#editDeathCaseId').val(result.data.case_id).trigger('change.select2');
        $('#editDeathDoctorId').val(result.data.doctor_id).trigger('change.select2');
        $('#editDescription').val(result.data.description);
        document.querySelector('#editDeathDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editDeathReportModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editDeathReportForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditDRSave');
  loadingButton.button('loading');
  $('#btnEditDRSave').attr('disabled', true);
  var id = $('#deathReportId').val();
  $.ajax({
    url: $('.deathReportUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editDeathReportModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#deathReportsTbl').DataTable().ajax.reload(null, false);
        $('#btnEditDRSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#btnEditDRSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addDeathReportModal', function () {
  resetModalForm('#addDeathReportNewForm', '#drValidationErrorsBox');
  $('#btnDRSave').attr('disabled', false);
  $('#deathCaseId, #deathDoctorId').val('').trigger('change.select2');
});
listenHiddenBsModal('#editDeathReportModal', function () {
  $('#btnEditDRSave').attr('disabled', false);
  resetModalForm('#editDeathReportForm', '#editDRValidationErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/user_profile/user_profile.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadUserProfileData);
function loadUserProfileData() {
  $('#language').select2({
    width: '100%',
    dropdownParent: $('#changeLanguageModal')
  });
  if (!$('#phoneNum').length) {
    return false;
  }
}
window.renderProfileData = function () {
  $.ajax({
    url: $('.profileUrl').val(),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var user = result.data;
        $('#editUserId').val(user.id);
        $('#firstName').val(user.first_name);
        $('#lastName').val(user.last_name);
        $('#email').val(user.email);
        $('#phoneNum').val(user.phone ? user.region_code + user.phone : '');
        // $('#editPhoto').attr('src', user.image_url);
        $('#editPhoto').css('background-image', 'url("' + user.image_url + '")');
        $('#editProfileModal').modal('show');
        // $('#phoneNum').attr('placeholder',Lang.get('messages.sms.phone_number'));

        Lang.setLocale($('.userCurrentLanguage').val());
        var input = document.querySelector('#phoneNum'),
          errorMsg = document.querySelector('#errorMsg'),
          validMsg = document.querySelector('#validMsg');
        var errorMap = [Lang.get('messages.common.invalid_number'), Lang.get('messages.common.invalid_country_code'), Lang.get('messages.common.too_short'), Lang.get('messages.common.too_long'), Lang.get('messages.common.invalid_number')];

        // initialise plugin
        if ($(".isEdit").val()) {
          var countryValue = $(".country-iso").val();
        } else {
          var countryValue = defaultCountryCodeValue;
        }
        var intl = window.intlTelInput(input, {
          initialCountry: defaultCountryCodeValue,
          separateDialCode: true,
          geoIpLookup: function geoIpLookup(success, failure) {
            $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
              var countryCode = resp && resp.country ? resp.country : '';
              success(countryCode);
            });
          },
          utilsScript: $('.utilsScript').val()
        });
        var reset = function reset() {
          input.classList.remove('error');
          errorMsg.innerHTML = '';
          errorMsg.classList.add('d-none');
          validMsg.classList.add('d-none');
          // validMsg.classList.add('d-none')
        };
        input.addEventListener('blur', function () {
          reset();
          if (input.value.trim()) {
            if (intl.isValidNumber()) {
              validMsg.classList.remove('d-none');
            } else {
              input.classList.add('error');
              var errorCode = intl.getValidationError();
              errorMsg.innerHTML = errorMap[errorCode];
              errorMsg.classList.remove('d-none');
            }
          }
        });

        // on keyup / change flag: reset
        input.addEventListener('change', reset);
        input.addEventListener('keyup', reset);
        var phoneNo = $('.phoneNo').val();
        if (typeof phoneNo != 'undefined' && phoneNo !== '') {
          setTimeout(function () {
            $('#phoneNum').trigger('change');
          }, 500);
        }
        listen('blur keyup change countrychange', function () {
          if (typeof phoneNo != 'undefined' && phoneNo !== '') {
            intl.setNumber('+' + phoneNo);
            phoneNo = '';
          }
          var getCode = intl.selectedCountryData['dialCode'];
          $('.prefix-code').val(getCode);
        });
        if ($('.isEdit').val()) {
          var getCode = intl.selectedCountryData['dialCode'];
          var country_iso = intl.selectedCountryData["iso2"];
          $('.prefix-code').val(getCode);
          $(".country-iso").val(country_iso);
        }
        $('#phoneNum').focus();
        $('#phoneNum').blur();
        var getPhoneNumber = $('#phoneNum').val();
        var removeSpacePhoneNumber = getPhoneNumber.replace(/\s/g, '');
        $('#phoneNum').val(removeSpacePhoneNumber);
      }
    }
  });
};
window.displayProfilePhoto = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
listenSubmit('#changePasswordForm', function (event) {
  event.preventDefault();
  var isValidate = validateUserPassword();
  if (!isValidate) {
    return false;
  }
  var loadingButton = jQuery(this).find('#btnPrPasswordEditSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('.changePasswordUrl').val(),
    type: 'post',
    data: new FormData($(this)[0]),
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        $('#changePasswordModal').modal('hide');
        displaySuccessMessage(result.message);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
function validateUserPassword() {
  var currentPassword = $('#pfCurrentPassword').val().trim();
  var password = $('#pfNewPassword').val().trim();
  var confirmPassword = $('#pfNewConfirmPassword').val().trim();
  if (currentPassword == '' || password == '' || confirmPassword == '') {
    $('#editPasswordValidationErrorsBox').show().html(Lang.get('messages.new_change.all_required_fields'));
    return false;
  }
  return true;
}
listenSubmit('#editProfileForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnPrEditSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('.profileUpdateUrl').val(),
    type: 'post',
    data: new FormData($(this)[0]),
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      $('#editProfileModal').modal('hide');
      setTimeout(function () {
        location.reload();
      }, 2000);
    },
    error: function error(result) {
      manageAjaxErrors(result, 'editProfileValidationErrorsBox');
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#changeLanguageForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnLanguageChange');
  loadingButton.button('loading');
  $.ajax({
    url: $('.updateLanguageURL').val(),
    type: 'post',
    data: new FormData($(this)[0]),
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      setTimeout(function () {
        location.reload();
      }, 2000);
    },
    error: function error(result) {
      manageAjaxErrors(result, 'editProfileValidationErrorsBox');
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#editProfileModal', function () {
  resetModalForm('#editProfileForm', '#editProfileValidationErrorsBox');
  $('#change-btn').show();
});

// open edit user profile model
listenClick('.editProfile', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  renderProfileData();
});
listenChange('#profileImage', function () {
  var ext = $(this).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) == -1) {
    $(this).val('');
    $('#editProfileValidationErrorsBox').html(Lang.get('messages.new_change.image_must_be')).show();
  } else {
    displayProfilePhoto(this, '#editPhoto');
  }
  $('#change-btn').hide();
});
listenClick('.changeType', function (e) {
  var inputField = $(this).parent().siblings();
  var oldType = inputField.attr('type');
  if (oldType == 'password') {
    $(this).children().addClass('icon-eye');
    $(this).children().removeClass('icon-ban');
    inputField.attr('type', 'text');
  } else {
    $(this).children().removeClass('icon-eye');
    $(this).children().addClass('icon-ban');
    inputField.attr('type', 'password');
  }
});
listenHiddenBsModal('#changePasswordModal', function () {
  resetModalForm('#changePasswordForm', '#editPasswordValidationErrorsBox');
});
listenHiddenBsModal('#changeLanguageModal', function () {
  $('#language').val($('.userCurrentLanguage').val()).trigger('change.select2');
});
listenClick('.remove-profile-image', function () {
  defaultImagePreview('#editPhoto', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************!*\
  !*** ./resources/assets/js/birth_reports/birth_reports.js ***!
  \************************************************************/


listenClick('.delete-birth-report-btn', function (event) {
  var birthReportId = $(event.currentTarget).attr('data-id');
  deleteItem($('.birthReportUrl').val() + '/' + birthReportId, '#birthReportsTbl', $('#birthReportLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/birth_reports/create-edit.js ***!
  \**********************************************************/


document.addEventListener('turbo:load', loadBirthReportData);
function loadBirthReportData() {
  $('#caseBrId, #birthDoctorId').select2({
    width: '100%',
    dropdownParent: $('#addBirthReportModal')
  });
  $('#editBRCaseId, #editBirthDoctorId').select2({
    width: '100%',
    dropdownParent: $('#editBirthReportModal')
  });
  $('#birthReportDate, #editBirthReportDate').flatpickr({
    dateFormat: 'Y-m-d h:i K',
    useCurrent: true,
    sideBySide: true,
    enableTime: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
  $('#addBirthReportModal, #editBirthReportModal').on('shown.bs.modal', function () {
    $('#caseBrId, #editCaseId:first').focus();
  });
}
listenSubmit('#addBirthReportNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnBRSave');
  loadingButton.button('loading');
  $('#btnBRSave').attr('disabled', true);
  $.ajax({
    url: $('.birthReportUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addBirthReportModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#birthReportsTbl').DataTable().ajax.reload(null, false);
        $('#btnBRSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#brValidationErrorsBox', result);
      $('#btnBRSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.edit-birth-report-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var birthReportId = $(event.currentTarget).attr('data-id');
  renderBirthReportData(birthReportId);
});
window.renderBirthReportData = function (id) {
  $.ajax({
    url: $('.birthReportUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#birthReportId').val(result.data.id);
        $('#editBRCaseId').val(result.data.case_id).trigger('change.select2');
        $('#editBirthDoctorId').val(result.data.doctor_id).trigger('change.select2');
        $('#editDescription').val(result.data.description);
        document.querySelector('#editBirthReportDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editBirthReportModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editBirthReportForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditBRSave');
  loadingButton.button('loading');
  $('#btnEditBRSave').attr('disabled', true);
  var id = $('#birthReportId').val();
  $.ajax({
    url: $('.birthReportUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editBirthReportModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#birthReportsTbl').DataTable().ajax.reload(null, false);
        $('#btnEditBRSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#btnEditBRSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addBirthReportModal', function () {
  resetModalForm('#addBirthReportNewForm', '#brValidationErrorsBox');
  $('#caseBrId, #birthDoctorId').val('').trigger('change.select2');
  $('#btnBRSave').attr('disabled', false);
});
listenHiddenBsModal('#editBirthReportModal', function () {
  resetModalForm('#editBirthReportForm', '#editBRValidationErrorsBox');
  $('#btnEditBRSave').attr('disabled', false);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/operation_reports/operation_reports.js ***!
  \********************************************************************/
listenClick('.delete-operation-reports-btn', function (event) {
  var operationReportId = $(event.currentTarget).attr('data-id');
  deleteItem($('#operationReportUrl').val() + '/' + operationReportId, '#operationReportsTable', $('#operationReportLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************!*\
  !*** ./resources/assets/js/operation_reports/create-edit.js ***!
  \**************************************************************/


document.addEventListener('turbo:load', loadOperationCreateEditData);
function loadOperationCreateEditData() {
  $('#operationDoctorId, #operationCaseId').select2({
    width: '100%',
    dropdownParent: $('#addOperationsReportsModal')
  });
  $('#editOperationDoctorId, #editOperationCaseId').select2({
    width: '100%',
    dropdownParent: $('#editOperationsReportsModal')
  });
  $('#operationDate, #editOperationDate').flatpickr({
    dateFormat: 'Y-m-d h:i K',
    useCurrent: true,
    sideBySide: true,
    enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
  listenHiddenBsModal('#addOperationsReportsModal, #editOperationsReportsModal', function () {
    $('#operationCaseId, #editOperationCaseId:first').focus();
  });
}
listenSubmit('#addOperationReportForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#operationReportSave');
  loadingButton.button('loading');
  $('#operationReportSave').attr('disabled', true);
  $.ajax({
    url: $('#operationReportCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addOperationsReportsModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#operationReportsTable').
        //     DataTable().
        //     ajax.
        //     reload(null, false);
        $('#operationReportSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#orValidationErrorsBox', result);
      $('#operationReportSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.edit-operation-reports-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var operationReportId = $(event.currentTarget).attr('data-id');
  renderOperationReportData(operationReportId);
});
window.renderOperationReportData = function (id) {
  $.ajax({
    url: $('#operationReportUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#operationReportId').val(result.data.id);
        $('#editOperationCaseId').val(result.data.case_id).trigger('change.select2');
        $('#editOperationDoctorId').val(result.data.doctor_id).trigger('change.select2');
        $('#editOperationDescription').val(result.data.description);
        document.querySelector('#editOperationDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editOperationsReportsModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editOperationReportsForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editOperationSave');
  loadingButton.button('loading');
  $('#editOperationSave').attr('disabled', true);
  var id = $('#operationReportId').val();
  $.ajax({
    url: $('#operationReportUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editOperationsReportsModal').modal('hide');
        window.livewire.emit('refresh');
        // $('#operationReportsTable').
        //     DataTable().
        //     ajax.
        //     reload(null, false);
        $('#editOperationSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#editOperationSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addOperationsReportsModal', function () {
  resetModalForm('#addOperationReportForm', '#orValidationErrorsBox');
  $('#operationReportSave').attr('disabled', false);
  $('#operationCaseId, #operationDoctorId').val('').trigger('change.select2');
});
listenHiddenBsModal('#editOperationsReportsModal', function () {
  resetModalForm('#editOperationReportsForm', '#editOperationErrorsBox');
  $('#editOperationSave').attr('disabled', false);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/employee_payrolls/employee_payrolls.js ***!
  \********************************************************************/
document.addEventListener('turbo:load', loadAdminEmployeePayrollData);
function loadAdminEmployeePayrollData() {
  listenClick('#employeePayrollResetFilter', function () {
    $('#employee_payroll_filter_status').val(0).trigger('change');
    hideDropdownManually($('#employeePayroll'), $('.dropdown-menu'));
  });
}
listenChange('#employee_payroll_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('.employee-payroll-delete-btn', function (event) {
  var employeePayrollId = $(event.currentTarget).attr('data-id');
  deleteItem($('#employeePayrollURL').val() + '/' + employeePayrollId, '#employeePayrollsTable', $('#employeePayrollLang').val());
});
listenClick('.employee-payroll-show-btn', function (event) {
  var employeePayrollId = $(event.currentTarget).attr('data-id');
  renderEmployeePayrollsData(employeePayrollId);
});
window.renderEmployeePayrollsData = function (id) {
  $.ajax({
    url: $('#employeePayrollShowModal').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#employee_payroll_sr_no').text(result.data.sr_no);
        $('#payroll_id').text(result.data.payroll_id);
        $('#payroll_role').text(result.data.type_string);
        $('#employee_full_name').text(result.data.full_name);
        // $('#employee_payroll_full_name').text(result.data.owner.user.full_name)
        $('#payroll_month').text(result.data.month);
        $('#payroll_year').text(result.data.year);
        $('#employee_payroll_salary').text(addCommas(result.data.basic_salary));
        $('#employee_payroll_allowance').text(addCommas(result.data.allowance));
        $('#employee_payroll_deductions').text(addCommas(result.data.deductions));
        $('#employee_payroll_net_salary').text(addCommas(result.data.net_salary));
        $('#employee_payroll_status').empty();
        if (result.data.status == 1) {
          $('#employee_payroll_status').append('<span class="badge bg-light-success">' + Lang.get('messages.invoice.paid') + '</span>');
        } else {
          $('#employee_payroll_status').append('<span class="badge bg-light-danger">' + Lang.get('messages.employee_payroll.unpaid') + '</span>');
        }
        $('#employee_payroll_created_on').text(moment(result.data.created_at).fromNow());
        $('#employee_payroll_updated_on').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showEmployeePayrolls').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************!*\
  !*** ./resources/assets/js/employee_payrolls/payrolls.js ***!
  \***********************************************************/
document.addEventListener('turbo:load', loadAdminPayrollData);
function loadAdminPayrollData() {
  $('.employeePayrollType,.EmployeePayrollOwnerType,.EmployeePayrollMonth,.EmployeePayrollStatus').select2({
    width: '100%'
  });
  $('.price-input').trigger('input');
  $('#employeePayrollType').focus();
}
listenChange('.EmployeePayrollBasicSalary,.EmployeePayrollAllowance,.EmployeePayrollDeductions', function () {
  var basicSalary = parseFloat(removeCommas($('.EmployeePayrollBasicSalary').val()));
  var allowance = parseFloat(removeCommas($('.EmployeePayrollAllowance').val()));
  var deductions = parseFloat(removeCommas($('.EmployeePayrollDeductions').val()));
  var netSalary = basicSalary + allowance - deductions;
  if (deductions > netSalary) {
    $('#validationErrorsBox').removeClass('d-none');
    $('#validationErrorsBox').text(Lang.get('messages.new_change.deduction_not_greater_than_salary')).show();
    $('.EmployeePayrollDeductions').val(null);
    deductions = 0;
    setTimeout(function () {
      $('#validationErrorsBox').addClass('d-none');
      $('#validationErrorsBox').text('');
    }, 7000);
  }
  !isNaN(netSalary) ? $('.employeePayrollNetSalary').val(netSalary).trigger('input') : $('.employeePayrollNetSalary').val(0);
});
listenChange('.employeePayrollType', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('.employeeURL').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length != 0) {
          $('.EmployeePayrollOwnerType').empty();
          $('.EmployeePayrollOwnerType').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('.EmployeePayrollOwnerType').append($('<option></option>').attr('value', i).text(v));
          });
        } else {
          $('.EmployeePayrollOwnerType').trigger('change');
        }
        if ($('.isEdit').val()) {
          $('.EmployeePayrollOwnerType').val($('#employeeOwnerId').val()).trigger('change');
          $('.isEdit').val(false);
        }
      }
    });
  }
  $('.EmployeePayrollOwnerType').empty();
  $('.EmployeePayrollOwnerType').prepend('<option value="0">' + Lang.get('messages.employee_payroll.select_employee') + '</option>');
  $('.EmployeePayrollOwnerType').prop('disabled', true);
});
listenSubmit('#createEmployeePayroll, #editEmployeePayroll', function () {
  $('.btnSave').attr('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/employee_payrolls/edit.js ***!
  \*******************************************************/
document.addEventListener('turbo:load', loadEditAdminEmployeePayroll);
function loadEditAdminEmployeePayroll() {
  setTimeout(function () {
    $('#editEmployeePayrollType').trigger('change');
  }, 1000);
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/patient_cases/patient_cases.js ***!
  \************************************************************/
listenClick('.delete-patient-case-btn', function (event) {
  var caseId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexPatientCaseUrl').val() + '/' + caseId, '#casesTbl', $('#patientCaseLang').val());
});
listenChange('#caseHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#caseResetFilter', function () {
  $('#caseHead').val(0).trigger('change');
  hideDropdownManually($('#caseFilterBtn'), $('.dropdown-menu'));
});

// status activation deactivation change event
listenChange('.patientCaseStatus', function (event) {
  var caseId = $(event.currentTarget).attr('data-id');
  caseActiveDeActiveStatus(caseId);
});

// activate de-activate Status
window.caseActiveDeActiveStatus = function (id) {
  $.ajax({
    url: $('#indexPatientCaseUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenClick('.show-patient-case-btn', function (event) {
  var patientCaseId = $(event.currentTarget).attr('data-id');
  renderPatientCaseData(patientCaseId);
});
window.renderPatientCaseData = function (id) {
  $.ajax({
    url: $('#patientCaseShowModal').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#case_id').text(result.data.case_id);
        $('#patient_name').text(result.data.patient.patient_user.full_name);
        $('#patient_phone').text(result.data.phone);
        $('#patient_doctor').text(result.data.doctor.doctor_user.full_name);
        $('#case_date').text(moment(result.data.date).format('Do MMM, Y h:mm A'));
        $('#case_fee').text($('#currentCurrency').val() + ' ' + addCommas(result.data.fee));
        $('#description').text(result.data.description);
        $('#patientStatus').empty();
        if (result.data.status == 1) {
          $('#patientStatus').append("<span class=\"badge bg-light-success\">".concat(Lang.get('messages.filter.active'), "</span>"));
        } else {
          $('#patientStatus').append("<span class=\"badge bg-light-danger\">".concat(Lang.get('messages.filter.deactive'), "</span>"));
        }
        $('#created_on').text(moment(result.data.created_at).fromNow());
        $('#updated_on').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showPatientCase').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/patient_cases/create-edit.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadPatientCaseData);
function loadPatientCaseData() {
  if (!$('#createPatientCaseForm').length && !$('#editPatientCaseForm').length) {
    return;
  }
  $('#casePatientId, #caseDoctorId').select2({
    width: '100%'
  });
  $('#caseDate').flatpickr({
    enableTime: true,
    // defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  $('#casePatientId').focus();
  $('.price-input').trigger('input');
}
listenSubmit('#createPatientCaseForm, #editPatientCaseForm', function () {
  $('#saveCaseBtn').attr('disabled', true);
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    $('#saveCaseBtn').attr('disabled', false);
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************!*\
  !*** ./resources/assets/js/employee/my_payrolls.js ***!
  \*****************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/assets/js/employee/doctors.js ***!
  \*************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*************************************************!*\
  !*** ./resources/assets/js/settings/setting.js ***!
  \*************************************************/


document.addEventListener('turbo:load', loadGeneralSettingData);
function loadGeneralSettingData() {
  $('#currencyType').select2({
    width: '100%'
  });
  listenChange('#appLogo , #favicon', function () {
    $('#generalValidationErrorsBox').addClass('d-none');
    if (isValidLogo($(this), '#generalValidationErrorsBox')) {
      displayLogo(this, '#logoPreviewImage');
    }
  });
  listenKeyup('#generalFacebookUrl', function () {
    this.value = this.value.toLowerCase();
  });
  listenKeyup('#generalTwitterUrl', function () {
    this.value = this.value.toLowerCase();
  });
  listenKeyup('#generalInstagramUrl', function () {
    this.value = this.value.toLowerCase();
  });
  listenKeyup('#generalLinkedInUrl', function () {
    this.value = this.value.toLowerCase();
  });
  listen('change', '#sidebarFilterStatus', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
    // $(tableName).DataTable().ajax.reload(null, true);
  });
  window.isValidLogo = function (inputSelector, validationMessageSelector) {
    var ext = $(inputSelector).val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['jpg', 'png', 'jpeg']) == -1) {
      $(inputSelector).val('');
      $(validationMessageSelector).removeClass('d-none');
      $(validationMessageSelector).html(Lang.get('messages.new_change.image_must_be')).show().delay(5000).slideUp(300);
      return false;
    }
    $(validationMessageSelector).hide();
    return true;
  };
  window.displayLogo = function (input, selector) {
    var displayPreview = true;
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      reader.onload = function (e) {
        var image = new Image();
        image.src = e.target.result;
        image.onload = function () {
          if (image.height != 60 && image.width != 90) {
            $(selector).val('');
            $('#generalValidationErrorsBox').removeClass('d-none');
            $('#generalValidationErrorsBox').html($('.settingImageValidation').val()).show();
            return false;
          }
          $(selector).attr('src', e.target.result);
          displayPreview = true;
        };
      };
      if (displayPreview) {
        reader.readAsDataURL(input.files[0]);
        $(selector).show();
      }
    }
  };
  listenClick('#resetSidebarFilter', function () {
    $('#sidebarFilterStatus').val(0).trigger('change');
    hideDropdownManually($('#sidebarDropdownbtn'), $('.dropdown-menu'));
  });
}
listen('change', '.sidebar-status', function (event) {
  var moduleId = $(event.currentTarget).attr('data-id');
  updateSidebarSettingStatus(moduleId);
});
window.updateSidebarSettingStatus = function (id) {
  $.ajax({
    url: $('#moduleURL').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        setTimeout(function () {
          window.location.reload();
        }, 5000);
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
        // tbl.ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenSubmit('#createHospitalSetting', function () {
  if ($('#error-msg').text() !== '') {
    $('#phoneNumber').focus();
    return false;
  }
  var facebookUrl = $('#generalFacebookUrl').val();
  var twitterUrl = $('#generalTwitterUrl').val();
  var instagramUrl = $('#generalInstagramUrl').val();
  var linkedInUrl = $('#generalLinkedInUrl').val();
  var facebookExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)facebook.[a-z]{2,3}\/?.*/i);
  var twitterExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)twitter\.[a-z]{2,3}\/?.*/i);
  var instagramUrlExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)instagram.[a-z]{2,3}\/?.*/i);
  var linkedInExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)linkedin\.[a-z]{2,3}\/?.*/i);
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  if (!facebookCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_facebook_url'));
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_twitter_url'));
    return false;
  }
  var instagramCheck = instagramUrl == '' ? true : instagramUrl.match(instagramUrlExp) ? true : false;
  if (!instagramCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************!*\
  !*** ./resources/assets/js/settings/credentials.js ***!
  \*****************************************************/
document.addEventListener('turbo:load', loadCredentialData);
function loadCredentialData() {
  var StripeCheckbox = $('#stripeEnable').is(':checked');
  if (StripeCheckbox) {
    $('.stripe-div').removeClass('d-none');
  } else {
    $('.stripe-div').addClass('d-none');
  }
  var PaypalCheckbox = $('#paypalEnable').is(':checked');
  if (PaypalCheckbox) {
    $('.paypal-div').removeClass('d-none');
  } else {
    $('.paypal-div').addClass('d-none');
  }
  var razorpayCheckbox = $('#razorpayEnable').is(':checked');
  if (razorpayCheckbox) {
    $('.razorpay-div').removeClass('d-none');
  } else {
    $('.razorpay-div').addClass('d-none');
  }
  var paytmCheckbox = $('#paytmEnable').is(':checked');
  if (paytmCheckbox) {
    $('.paytm-div').removeClass('d-none');
  } else {
    $('.paytm-div').addClass('d-none');
  }
  var paystackCheckbox = $('#paystackEnable').is(':checked');
  if (paystackCheckbox) {
    $('.paystack-div').removeClass('d-none');
  } else {
    $('.paystack-div').addClass('d-none');
  }
}
listen('change', '#stripeEnable', function () {
  var StripeCheckbox = $('#stripeEnable').is(':checked');
  if (StripeCheckbox) {
    $('.stripe-div').removeClass('d-none');
  } else {
    $('.stripe-div').addClass('d-none');
  }
});
listen('change', '#paypalEnable', function () {
  var PaypalCheckbox = $('#paypalEnable').is(':checked');
  if (PaypalCheckbox) {
    $('.paypal-div').removeClass('d-none');
  } else {
    $('.paypal-div').addClass('d-none');
  }
});
listen('change', '#razorpayEnable', function () {
  var razorpayCheckbox = $('#razorpayEnable').is(':checked');
  if (razorpayCheckbox) {
    $('.razorpay-div').removeClass('d-none');
  } else {
    $('.razorpay-div').addClass('d-none');
  }
});
listen('change', '#paytmEnable', function () {
  var paytmCheckbox = $('#paytmEnable').is(':checked');
  if (paytmCheckbox) {
    $('.paytm-div').removeClass('d-none');
  } else {
    $('.paytm-div').addClass('d-none');
  }
});
listen('change', '#paystackEnable', function () {
  var payStackCheckbox = $('#paystackEnable').is(':checked');
  if (payStackCheckbox) {
    $('.paystack-div').removeClass('d-none');
  } else {
    $('.paystack-div').addClass('d-none');
  }
});
listenSubmit('#UserCredentialsSettings', function (e) {
  e.preventDefault();
  var StripeCheckbox = $('#stripeEnable').is(':checked');
  var PaypalCheckbox = $('#paypalEnable').is(':checked');
  var razorpayCheckbox = $('#razorpayEnable').is(':checked');
  var paytmCheckbox = $('#paytmEnable').is(':checked');
  var paystackCheckbox = $('#paystackEnable').is(':checked');
  if (StripeCheckbox && $('#stripeKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.stripe_key'));
    return false;
  }
  if (StripeCheckbox && $('#stripeSecret').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.stripe_secret'));
    return false;
  }
  if (PaypalCheckbox && $('#paypalKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_client_id'));
    return false;
  }
  if (PaypalCheckbox && $('#paypalSecret').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_secret'));
    return false;
  }
  if (PaypalCheckbox && $('#paypalMode').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_mode'));
    return false;
  }
  if (razorpayCheckbox && $('#razorpayKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.razorpay_key'));
    return false;
  }
  if (razorpayCheckbox && $('#razorpaySecret').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.razor_pay_secret'));
    return false;
  }
  if (paytmCheckbox && $('#paytmMerchantId').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paytm_id'));
    return false;
  }
  if (paytmCheckbox && $('#paytmMerchantKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paytm_key'));
    return false;
  }
  if (paystackCheckbox && $('#paystackPublicKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paystack_key'));
    return false;
  }
  if (paystackCheckbox && $('#paystackSecretKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paystack_secret'));
    return false;
  }
  $('#UserCredentialsSettings')[0].submit();
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************!*\
  !*** ./resources/assets/js/super_admin_settings/setting.js ***!
  \*************************************************************/
document.addEventListener('turbo:load', loadSuperAdminSettingDate);
function loadSuperAdminSettingDate() {
  var CaptchaCheckbox = $('#captchaEnableAdmin').is(':checked');
  // let stripeCheckbox = $('#stripeEnableAdmin').is(':checked')
  // let paypalCheckbox = $('#paypalEnableAdmin').is(':checked')
  // let razorpayCheckbox = $('#razorpayEnableAdmin').is(':checked')

  if (CaptchaCheckbox) {
    $('.captcha-div').removeClass('d-none');
  } else {
    $('.captcha-div').addClass('d-none');
  }
  // if (stripeCheckbox) {
  //     $('.stripe-div-admin').removeClass('d-none')
  // } else {
  //     $('.stripe-div-admin').addClass('d-none')
  // }
  // if (paypalCheckbox) {
  //     $('.paypal-div-admin').removeClass('d-none')
  // } else {
  //     $('.paypal-div-admin').addClass('d-none')
  // }
  // if (razorpayCheckbox) {
  //     $('.razorpay-div-admin').removeClass('d-none')
  // } else {
  //     $('.razorpay-div-admin').addClass('d-none')
  // }
  if (typeof $('#footerSettingPhoneNumber').val() != 'undefined' && $('#footerSettingPhoneNumber').val() !== '') $('.phoneNumber').trigger('blur');
  if ($('#defaultCountryCode').length) {
    var input = document.querySelector('#defaultCountryData');
    var intl = window.intlTelInput(input, {
      initialCountry: defaultCountryCodeValue,
      separateDialCode: true,
      geoIpLookup: function geoIpLookup(success, failure) {
        $.get('https://ipinfo.io', function () {}, 'jsonp').always(function (resp) {
          var countryCode = resp && resp.country ? resp.country : '';
          success(countryCode);
        });
      },
      utilsScript: '../../public/assets/js/inttel/js/utils.min.js'
    });
    var getCode = intl.selectedCountryData['name'] + '+' + intl.selectedCountryData['dialCode'];
    $('#defaultCountryData').val(getCode);
    // $('.iti__flag').attr('class').split(' ')[1]
  }
  $('#defaultLanguage').select2({
    width: '100%'
  });
  if (!$('#footerSettingPhoneNumber').length) {
    return;
  }
}
listenChange('#appLogo', function () {
  $('#validationErrorsBox').addClass('d-none');
  if (isValidLogo($(this), '#validationErrorsBox')) {
    displayLogo(this, '#previewImage');
  }
});
listenSubmit('#createSetting', function (event) {
  event.preventDefault();
  var captchaCheckbox = $('#captchaEnableAdmin').is(':checked');
  if (captchaCheckbox && $('#captchaKey').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.captcha_key'));
    return false;
  }
  if (captchaCheckbox && $('#captchaSecret').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.captcha_secret'));
    return false;
  }
  $('#createSetting')[0].submit();
  return true;
});
listenSubmit('#adminPaymentForm', function (event) {
  event.preventDefault();
  if ($('#StripeAdminKey').val().trim() != '' && $('#StripeAdminSecret').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.stripe_secret'));
    return false;
  }
  if ($('#StripeAdminKey').val().trim() == '' && $('#StripeAdminSecret').val().trim() != '') {
    displayErrorMessage(Lang.get('messages.new_change.stripe_secret'));
    return false;
  }
  if ($('#paypalKeyAdmin').val().trim() == '' && $('#paypalSecretAdmin').val().trim() != '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_client_id'));
    return false;
  }
  if ($('#paypalSecretAdmin').val().trim() != '' && $('#paypalSecretAdmin').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_secret'));
    return false;
  }
  if ($('#paypalModeAdmin').val().trim() == '' && $('#paypalSecretAdmin').val().trim() != '' && $('#paypalSecretAdmin').val().trim() != '') {
    displayErrorMessage(Lang.get('messages.new_change.paypal_mode'));
    return false;
  }
  if ($('#razorpayKeyAdmin').val().trim() != '' && $('#razorpaySecretAdmin').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.razor_pay_secret'));
    return false;
  }
  if ($('#razorpaySecretAdmin').val().trim() != '' && $('#razorpayKeyAdmin').val().trim() == '') {
    displayErrorMessage(Lang.get('messages.new_change.razorpay_key'));
    return false;
  }
  $('#adminPaymentForm')[0].submit();
  return true;
});
window.isValidLogo = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['jpg', 'png', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).removeClass('d-none');
    $(validationMessageSelector).html(Lang.get('messages.new_change.image_must_be')).show();
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
};
window.displayLogo = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        /*
        if (image.height != 60 && image.width != 90) {
            $(selector).val('');
            $('#validationErrorsBox').removeClass('d-none');
            $('#validationErrorsBox').
                html($('#imageValidation').val()).
                show();
            return false;
        }
         */
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
listenClick('.iti__standard', function () {
  $('#defaultCountryData').val($(this).text());
  $(this).attr('data-country-code');
  $('#defaultCountryCode').val($(this).attr('data-country-code'));
});
listenClick('#resetFilter', function () {
  $('#filter_status').val('2').trigger('change');
  hideDropdownManually('.dropdown-menu,#dropdownMenuButton1');
});
listenSubmit('#superAdminFooterSettingForm', function (event) {
  event.preventDefault();
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
  var facebookUrl = $('#facebookUrl').val();
  var twitterUrl = $('#twitterUrl').val();
  var instagramUrl = $('#instagramUrl').val();
  var linkedInUrl = $('#linkedInUrl').val();
  var facebookExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)facebook.[a-z]{2,3}\/?.*/i);
  var twitterExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)twitter\.[a-z]{2,3}\/?.*/i);
  var instagramUrlExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)instagram.[a-z]{2,3}\/?.*/i);
  var linkedInExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)linkedin\.[a-z]{2,3}\/?.*/i);
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  if (!facebookCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_facebook_url'));
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_twitter_url'));
    return false;
  }
  var instagramCheck = instagramUrl == '' ? true : instagramUrl.match(instagramUrlExp) ? true : false;
  if (!instagramCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    return false;
  }
  $('#superAdminFooterSettingForm')[0].submit();
  return true;
});
listenClick('.iti__standard,.iti__preferred', function () {
  $('#defaultCountryData').val($(this).text());
  $('#defaultCountryCode').val($(this).attr('data-country-code'));
});
listen('change', '#captchaEnableAdmin', function () {
  var StripeCheckbox = $('#captchaEnableAdmin').is(':checked');
  if (StripeCheckbox) {
    $('.captcha-div').removeClass('d-none');
  } else {
    $('.captcha-div').addClass('d-none');
  }
});

// listen('change', '#stripeEnableAdmin', function () {
//     let StripeCheckbox = $('#stripeEnableAdmin').is(':checked')
//     if (StripeCheckbox) {
//         $('.stripe-div-admin').removeClass('d-none')
//     } else {
//         $('.stripe-div-admin').addClass('d-none')
//     }
// })
// listen('change', '#paypalEnableAdmin', function () {
//     let paypalEnableAdmin = $('#paypalEnableAdmin').is(':checked')
//     if (paypalEnableAdmin) {
//         $('.paypal-div-admin').removeClass('d-none')
//     } else {
//         $('.paypal-div-admin').addClass('d-none')
//     }
// })
// listen('change', '#razorpayEnableAdmin', function () {
//     let razorpayEnableAdmin = $('#razorpayEnableAdmin').is(':checked')
//     if (razorpayEnableAdmin) {
//         $('.razorpay-div-admin').removeClass('d-none')
//     } else {
//         $('.razorpay-div-admin').addClass('d-none')
//     }
// })
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************************!*\
  !*** ./resources/assets/js/doctors_departments/doctors_departments.js ***!
  \************************************************************************/


listenClick('.doctor-department-delete-btn', function (event) {
  var doctorDepartmentId = event.currentTarget.dataset.id;
  deleteItem($('#indexDoctorDepartmentUrl').val() + '/' + doctorDepartmentId, '#doctorsDepartmentsTable', $('#doctorDepartmentLang').val());
});
listenSubmit('#addDoctorDepartmentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#doctorDepartmentSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#indexDoctorDepartmentCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_doctor_departments_modal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#doctorDepartmentErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.doctor-department-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var doctorDepartmentId = event.currentTarget.dataset.id;
  renderDoctorDepartmentData(doctorDepartmentId);
});
function renderDoctorDepartmentData(id) {
  $.ajax({
    url: $('#indexDoctorDepartmentUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#doctorDepartmentId').val(result.data.id);
        $('#editDoctorDepartmentTitle').val(result.data.title);
        $('#editDoctorDepartmentDescription').val(result.data.description);
        $('#edit_doctor_departments_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editDoctorDepartmentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editDoctorDepartmentSave');
  loadingButton.button('loading');
  var id = $('#doctorDepartmentId').val();
  $.ajax({
    url: $('#indexDoctorDepartmentUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_doctor_departments_modal').modal('hide');
        if ($('#showDoctorDepartmentUrl').length) {
          window.location.href = $('#showDoctorDepartmentUrl').val();
        } else {
          livewire.emit('refresh');
        }
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_doctor_departments_modal', function () {
  resetModalForm('#addDoctorDepartmentForm', '#doctorDepartmentErrorsBox');
});
listenHiddenBsModal('#edit_doctor_departments_modal', function () {
  resetModalForm('#editDoctorDepartmentForm', '#editDoctorDepartmentErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************************!*\
  !*** ./resources/assets/js/doctors_departments/doctor_departments_list.js ***!
  \****************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************************!*\
  !*** ./resources/assets/js/investigation_reports/investigation_reports.js ***!
  \****************************************************************************/


document.addEventListener('turbo:load', loadInvestigationReportData);
function loadInvestigationReportData() {
  listenClick('#resetInReportFilter', function () {
    $('#filterInReportStatus').val(2).trigger('change');
    hideDropdownManually($('#investigationReportMenuButton'), $('.dropdown-menu'));
  });
  listenChange('#filterInReportStatus', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  });
  listenClick('.delete-in-report-btn', function (event) {
    var investigationReportId = $(event.currentTarget).attr('data-id');
    deleteItem($('#indexInvestigationReportUrl').val() + '/' + investigationReportId, '#investigationReportTable', $('#investigationReportLang').val());
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************************************!*\
  !*** ./resources/assets/js/investigation_reports/create-edit.js ***!
  \******************************************************************/


document.addEventListener('turbo:load', loadInReportCreateEditData);
function loadInReportCreateEditData() {
  $('#date').flatpickr({
    format: 'YYYY-MM-DD HH:mm:ss',
    useCurrent: true,
    sideBySide: true,
    enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
  $('.patient-in-report-id,.doctor-in-report-id,.status-in-report').select2({
    width: '100%'
  });
  $('#createInvestigationForm, #editInvestigationForm').find('input:text:visible:first').focus();
}
listenChange('#investigationAttachment', function () {
  var extension = isValidAttachmentDocument($(this), '#validationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#validationErrorsBox').html('').hide();
    //document url
    if (extension === 'pdf') {
      $('#previewImage').css('background-image', 'url(' + $('#pdfDocumentImageUrl').val() + ')');
    } else if (extension === 'doc') {
      $('#previewImage').css('background-image', 'url(' + $('#docxDocumentImageUrl').val() + ')');
    }
    //old preview
    // displayDocument(this, '#previewImage', extension);
  }
});
window.isValidAttachmentDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    // $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
    // return false;
  }
  return ext;
};
listenClick('.remove-image', function () {
  defaultImagePreview('#previewImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/assets/js/accounts/accounts.js ***!
  \**************************************************/


document.addEventListener('turbo:load', loadAccountCreateEdit);
function loadAccountCreateEdit() {
  if (!$('#addAccountForm').length && !$('#editAccountForm').length) {
    return false;
  }
}
listenChange('.account-status', function (event) {
  var accountId = $(event.currentTarget).attr('data-id');
  updateAccountStatus(accountId);
});
function updateAccountStatus(id) {
  $.ajax({
    url: $('.indexAccountUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        // $(tableName).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    }
  });
}
listenSubmit('#addAccountForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnAccountSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#indexAccountCreateUrl').val(),
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  newRecord(data, loadingButton, '#add_accounts_modal');
});
listenSubmit('#editAccountForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editAccountSave');
  loadingButton.button('loading');
  var id = $('#accountId').val();
  var url = $('#indexAccountUrl').val() + '/' + +id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'PUT'
    // 'tableSelector': tableName,
  };
  if ($('#accountShowUrl').length) {
    editRecordWithForm(data, loadingButton, '#edit_accounts_modal');
    window.location.href = $('#accountShowUrl').val();
  } else {
    editRecordWithForm(data, loadingButton, '#edit_accounts_modal');
  }
});
listen('click', '.account-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var accountId = $(event.currentTarget).attr('data-id');
  renderAccountData(accountId);
});
listen('click', '.account-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexAccountUrl').val() + '/' + +id, '', $('#account').val());
});
function renderAccountData(id) {
  $.ajax({
    url: $('#indexAccountUrl').val() + '/' + +id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#accountId').val(result.data.id);
        $('#editName').val(result.data.name);
        $('#editDescription').val(result.data.description);
        if (result.data.status) {
          $('#editIsActive').val(1).prop('checked', true);
        }
        if (result.data.type == 1) {
          $('#editDebit').prop('checked', true);
        } else {
          $('#editCredit').prop('checked', true);
        }
        $('#edit_accounts_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenChange('#account_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('#account_filter_type', function () {
  window.livewire.emit('changeTypeFilter', 'account_filter_type', $(this).val());
});
listen('click', '#accountResetFilter', function () {
  $('#account_filter_status, #account_filter_type').val(0).trigger('change');
  hideDropdownManually($('#accountFilterBtn'), $('.dropdown-menu'));
});
listenHiddenBsModal('#add_accounts_modal', function () {
  resetModalForm('#addAccountForm', '#validationErrorsBox');
});
listenHiddenBsModal('#edit_accounts_modal', function () {
  resetModalForm('#editAccountForm', '#editValidationErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/accounts/payments_list.js ***!
  \*******************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************!*\
  !*** ./resources/assets/js/insurances/insurances.js ***!
  \******************************************************/
listenClick('.insurances-delete-btn', function (event) {
  var insuranceId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexInsuranceUrl').val() + '/' + insuranceId, '#insurancesTbl', $('#insuranceLang').val());
});
listenChange('.insuranceStatus', function (event) {
  var insuranceId = $(event.currentTarget).attr('data-id');
  updateInsuranceStatus(insuranceId);
});
listenClick('#insuranceResetFilter', function () {
  $('#filter_status').val(2).trigger('change');
});
window.updateInsuranceStatus = function (id) {
  $.ajax({
    url: $('#indexInsuranceUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenChange('#insurancesFilterStatus', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#insuranceResetFilter', function () {
  $('#insurancesFilterStatus').val(0).trigger('change');
  hideDropdownManually($('#insuranceFilterBtn'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/insurances/create-edit.js ***!
  \*******************************************************/
document.addEventListener('turbo:load', loadUpdateInsurancesData);
function loadUpdateInsurancesData() {
  $('.price-input').trigger('input');
  if ($('.insuranceDiscount').val() < 0) {
    $('.discount').val(0);
  }
  if ($('.addInsuranceItem').val() < 0) {
    $('.discount').val(0);
  }
  $('#insuranceDiscountId').blur(function () {
    if ($('#insuranceDiscountId').val().length == 0) {
      $('#insuranceDiscountId').val(0);
    }
  });
  $('.insuranceForm').find('input:text:visible:first').focus();
  window.isInsuranceNumberKey = function (evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    return !((charCode !== 46 || $(element).val().indexOf('.') !== -1) && (charCode < 48 || charCode > 57));
  };
  listenChange('.service-tax, .discount, .hospital-rate, .disease-charge', function () {
    calculateAndSetInsuranceAmount();
  });
  window.calculateAndSetInsuranceAmount = function () {
    var totalAmount = 0;
    var serviceTax = parseInt($('.service-tax').val() !== '' ? removeCommas($('.service-tax').val()) : 0);
    var hospitalRate = parseInt($('.hospital-rate').val() !== '' ? removeCommas($('.hospital-rate').val()) : 0);
    var discount = parseFloat($('.discount').val());
    totalAmount = serviceTax + hospitalRate;
    $('.disease-item-container>tr').each(function () {
      var itemTotal = parseInt($(this).find('.disease-charge').val() != '' ? removeCommas($(this).find('.disease-charge').val()) : 0);
      totalAmount += itemTotal;
    });
    totalAmount -= totalAmount * discount / 100;
    $('#insuranceTotal').text(addCommas(totalAmount.toFixed(2)));
    $('#insuranceTotal_amount').val(totalAmount);
  };
}
listenSubmit('#insuranceForm', function (event) {
  event.preventDefault();
  // screenLock();
  $('#insuranceSaveBtn').attr('disabled', true);
  var loadingButton = jQuery(this).find('#insuranceSaveBtn');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.insuranceSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.insuranceUrl').val();
      $('#insuranceSaveBtn').attr('disabled', false);
    },
    error: function error(result) {
      printErrorMessage('#insuranceValidationErrorsBox', result);
      $('#insuranceSaveBtn').attr('disabled', false);
    }
    // complete: function () {
    //     screenUnLock()
    //     loadingButton.button('reset')
    // },
  });
});
var uniqueInsuranceId = $('.insuranceUniqueId').val();
listenClick('#addInsuranceItem', function () {
  var data = {
    'uniqueId': uniqueInsuranceId
  };
  var diseaseItemHtml = prepareTemplateRender('#insuranceDiseaseTemplate', data);
  $('.disease-item-container').append(diseaseItemHtml);
  uniqueInsuranceId++;
  resetInsuranceItemIndex();
});
listenClick('.delete-disease', function () {
  $(this).parents('tr').remove();
  resetInsuranceItemIndex();
  calculateAndSetInsuranceAmount();
});
function resetInsuranceItemIndex() {
  var index = 1;
  $('.disease-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    $('#insuranceTotal').text('0');
    $('#insuranceBillTbl tbody').append('<tr>' + '<td class="text-center item-number">1</td>' + '<td><input class="form-control disease-name" required name="disease_name[]" type="text"></td>' + '<td><input class="form-control disease-charge price-input" required name="disease_charge[]" type="text"></td>' + '<td class="text-center"><a href="javascript:void(0)" title="{{__(\'messages.common.delete\')}}"  class="delete-disease btn px-1 text-danger fs-3 pe-0">\n' + '                    <i class="fa-solid fa-trash"></i>\n' + '                            </a></td>' + '</tr>');
  }
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/assets/js/payments/payments.js ***!
  \**************************************************/
listenClick('.payment-delete-btn', function (event) {
  var paymentId = $(event.currentTarget).attr('data-id');
  deleteItem($('#paymentURL').val() + '/' + paymentId, '#paymentsTbl', $('#paymentLang').val());
});
listenClick('.payment-show-btn', function (event) {
  var paymentId = $(event.currentTarget).attr('data-id');
  renderPaymentData(paymentId);
});
window.renderPaymentData = function (id) {
  $.ajax({
    url: $('#paymentShowURL').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#payment_account').text(result.data.account.name);
        $('#payment_date').text(moment(result.data.payment_date).format('Mo MMM, YYYY'));
        $('#payment_pay_to').text(result.data.pay_to);
        $('#payment_amount').text(result.data.amount);
        $('#payment_created_on').text(moment(result.data.created_at).fromNow());
        $('#payment_updated_on').text(moment(result.data.updated_at).fromNow());
        $('#payment_description').text(result.data.description);
        $('#payment_description').css('overflow-wrap', 'break-word');
        setValueOfEmptySpan();
        $('#showPayment').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************!*\
  !*** ./resources/assets/js/payment_reports/payments_reports.js ***!
  \*****************************************************************/
document.addEventListener('turbo:load', loadPaymentReportDate);
function loadPaymentReportDate() {
  $('#filterPaymentAccount').select2({
    width: '100%'
  });
}
listenChange('#filterPaymentAccount', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#resetPaymentReportFilter', function () {
  $('#filterPaymentAccount').val(0).trigger('change');
  hideDropdownManually($('#paymentReportFilter'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************!*\
  !*** ./resources/assets/js/payments/create-edit.js ***!
  \*****************************************************/
document.addEventListener('turbo:load', loadCreatePaymentData);
function loadCreatePaymentData() {
  $('#paymentDate').flatpickr({
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  $('select').focus();
  $('.price-input').trigger('input');
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************!*\
  !*** ./resources/assets/js/hospital_schedule/create-edit.js ***!
  \**************************************************************/


listenSubmit('#saveForm', function (event) {
  event.preventDefault();
  var data = new FormData($(this)[0]);
  $.ajax({
    url: $('.checkRecords').val(),
    type: 'POST',
    data: $(this).serialize(),
    cache: false,
    success: function success(result) {
      saveUpdateForm(data);
    },
    error: function error(result) {
      swal({
        title: Lang.get('messages.new_change.warning'),
        text: result.responseJSON.message,
        icon: 'warning',
        buttons: {
          confirm: $('.yesVariable').val(),
          cancel: $('.noVariable').val()
        }
      }).then(function (result) {
        if (result) {
          saveUpdateForm(data);
        }
      });
    }
  });
});
function saveUpdateForm(data) {
  $.ajax({
    url: $('.hospitalScheduleRoute').val(),
    type: 'POST',
    data: data,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        setTimeout(function () {
          location.reload();
        }, 1500);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
}
listen('change', 'select[name^="startTimes"]', function (e) {
  var selectedIndex = $(this)[0].selectedIndex;
  var endTimeOptions = $(this).closest('.weekly-row').find('select[name^="endTimes"] option');
  endTimeOptions.eq(selectedIndex + 1).prop('selected', true).trigger('change');
  endTimeOptions.each(function (index) {
    if (index <= selectedIndex) {
      $(this).attr('disabled', true);
    } else {
      $(this).attr('disabled', false);
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/assets/js/invoices/invoice.js ***!
  \*************************************************/
document.addEventListener('turbo:load', loadAdminInvoiceData);
function loadAdminInvoiceData() {
  listen('click', '#resetEmployeeInvoiceFilter', function () {
    $('#invoice_status_filter').val(2).trigger('change');
    hideDropdownManually($('#invoiceFilterBtn'), $('.dropdown-menu'));
  });
}
listen('click', '.deleteInvoicesBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexInvoiceUrl').val() + '/' + id, '', $('#invoiceLang').val());
});
listenChange('#invoice_status_filter', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listen('click', '.sendInvoiceBtn', function (event) {
  event.preventDefault();
  var loadingButton = $(this);
  loadingButton.text(Lang.get('messages.new_change.sending'));
  loadingButton.attr('disabled', true);
  $.ajax({
    url: $('#sendInvoiceRouteId').val(),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        loadingButton.text(Lang.get('messages.invoice.send_mail'));
        displaySuccessMessage(result.message);
        setTimeout(function () {
          loadingButton.attr('disabled', false);
        }, 6000);
      }
    },
    error: function error(result) {
      loadingButton.attr('disabled', false);
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************!*\
  !*** ./resources/assets/js/invoices/new.js ***!
  \*********************************************/
document.addEventListener('turbo:load', loadUpdateInvoiceData);
function loadUpdateInvoiceData() {
  if (!$('.invoiceSaveUrl')) {
    return;
  }
  $('input:text:not([readonly="readonly"])').first().blur();
  $('#invoicePatientId').focus();
  dropdownToSelect2Account('.accountId');
  $('#invoice_date').flatpickr({
    defaultDate: new Date(),
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  $('#editInvoiceDate').flatpickr({
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  window.isNumberKey = function (evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    return !((charCode !== 46 || $(element).val().indexOf('.') !== -1) && (charCode < 48 || charCode > 57));
  };
  listenClick('.deleteInvoiceItem', function () {
    $(this).parents('tr').remove();
    resetInvoiceItemIndex();
    calculateAndSetInvoiceAmount();
  });
  listenKeyup('.qty', function () {
    var qty = parseInt($(this).val());
    var rate = $(this).parent().siblings().find('.price').val();
    rate = parseInt(removeCommas(rate));
    var amount = calculateAmount(qty, rate);
    $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
    calculateAndSetInvoiceAmount();
  });
  listenKeyup('.price', function () {
    var rate = $(this).val();
    rate = parseInt(removeCommas(rate));
    var qty = parseInt($(this).parent().siblings().find('.qty').val());
    var amount = calculateAmount(qty, rate);
    $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
    calculateAndSetInvoiceAmount();
  });
  var calculateAmount = function calculateAmount(qty, rate) {
    if (qty > 0 && rate > 0) {
      return qty * rate;
    } else {
      return 0;
    }
  };
  var calculateAndSetInvoiceAmount = function calculateAndSetInvoiceAmount() {
    var totalAmount = 0;
    $('.invoice-item-container>tr').each(function () {
      var itemTotal = $(this).find('.item-total').text();
      itemTotal = removeCommas(itemTotal);
      itemTotal = isEmpty($.trim(itemTotal)) ? 0 : parseInt(itemTotal);
      totalAmount += itemTotal;
    });
    totalAmount = parseFloat(totalAmount);
    $('#total').text(addCommas(totalAmount.toFixed(2)));

    //set hidden input value
    $('#total_amount').val(totalAmount);
    calculateDiscount();
  };
  var calculateDiscount = function calculateDiscount() {
    var discount = $('#discount').val();
    var totalAmount = removeCommas($('#total').text());
    if (isEmpty(discount) || isEmpty(totalAmount)) {
      discount = 0;
    }
    var discountAmount = totalAmount * discount / 100;
    var finalAmount = totalAmount - discountAmount;
    $('#finalAmount').text(addCommas(finalAmount.toFixed(2)));
    $('#total_amount').val(finalAmount.toFixed(2));
    $('#discountAmount').text(addCommas(discountAmount.toFixed(2)));
  };
  listenKeyup('#discount', function (e) {
    calculateDiscount();
  });
}
listenSubmit('.invoiceForm', function (event) {
  event.preventDefault();
  // screenLock();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.invoiceSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.invoiceUrl').val() + '/' + result.data.id;
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
    }
    // complete: function () {
    //     screenUnLock();
    // },
  });
});
listenClick('#addInvoiceItem', function () {
  var uniqueId = $('.uniqueId').val();
  var data = {
    'accounts': JSON.parse($('.invoiceAccounts').val()),
    'uniqueId': uniqueId
  };
  var invoiceItemHtml = prepareTemplateRender('#invoiceItemTemplate', data);
  $('.invoice-item-container').append(invoiceItemHtml);
  dropdownToSelect2Account('.accountId');
  uniqueId++;
  resetInvoiceItemIndex();
});
var resetInvoiceItemIndex = function resetInvoiceItemIndex() {
  var index = 1;
  $('.invoice-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    var uniqueId = $('.uniqueId').val();
    var data = {
      'accounts': JSON.parse($('.invoiceAccounts').val()),
      'uniqueId': uniqueId
    };
    var invoiceItemHtml = prepareTemplateRender('#invoiceItemTemplate', data);
    $('.invoice-item-container').append(invoiceItemHtml);
    dropdownToSelect2Account('.accountId');
    uniqueId++;
  }
};
function dropdownToSelect2Account(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.document.select_account'),
    width: '100%'
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/schedules/schedules.js ***!
  \****************************************************/
listenClick('.delete-schedule-btn', function (event) {
  var scheduleId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexScheduleUrl').val() + '/' + scheduleId, '#schedulesTbl', $('#scheduleLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************!*\
  !*** ./resources/assets/js/schedules/create-edit.js ***!
  \******************************************************/
document.addEventListener('turbo:load', loadSchedules);
function loadSchedules() {
  if (!$('.scheduleForm').length) {
    return;
  }
  $('#doctorId, #serialVisibilityId').select2({
    width: '100%'
  });
  $('.perPatientTime').flatpickr({
    enableTime: true,
    noCalendar: true,
    enableSeconds: true,
    dateFormat: 'H:i:S',
    time_24hr: true,
    locale: $('.userCurrentLanguage').val()
  });
  $('#doctorId').first().focus();
  var hospitalDayOfWeek = [];
  var hospitalStartTime = [];
  $.each(JSON.parse($('.hospitalSchedule').val()), function (i, v) {
    hospitalDayOfWeek[i] = parseInt(v.day_of_week);
    hospitalStartTime[v.day_of_week] = [v.start_time, v.end_time];
  });
  var i = 0;
  var perPatTime = $('.perPatientTime').val();
  for (i; i <= 7; i++) {
    if ($.inArray(i, hospitalDayOfWeek) !== -1) {
      hospitalDayOfWeek.sort();
      $('.cpy-btn' + (hospitalDayOfWeek[0] - 1)).hide();
      $('.hospitalScheduleFrom-' + i).flatpickr({
        enableTime: true,
        noCalendar: true,
        enableSeconds: true,
        dateFormat: 'H:i:S',
        time_24hr: true,
        minTime: hospitalStartTime[i][0],
        locale: $('.userCurrentLanguage').val()
        // onChange: function (selectedDate, dateStr) {
        //     hospitalToSchedule.clear();
        //     hospitalToSchedule.set('minTime', dateStr);
        // },
      });
      hospitalToSchedule = $('.hospitalScheduleTo-' + i).flatpickr({
        enableTime: true,
        noCalendar: true,
        enableSeconds: true,
        dateFormat: 'H:i:S',
        time_24hr: true,
        locale: $('.userCurrentLanguage').val(),
        minTime: hospitalStartTime[i][0].split(':')[0] + ':' + parseInt(hospitalStartTime[i][0].split(':')[1]) + 5,
        maxTime: hospitalStartTime[i][1]
      });
    } else {
      $('.hospitalScheduleFrom-' + i).parent().parent().hide();
    }
  }
  function checkedEle(element) {
    if (element.prev().length > 0) {
      if (element.prev().css('display') == 'none') {
        return checkedEle(element.prev());
      } else {
        return element.prev();
      }
    }
  }
  listenClick('.copy-btn', function (e) {
    e.preventDefault();
    var Ele = checkedEle($(this).parent().parent());
    var id = $(e.currentTarget).attr('data-id');
    var oldId = id - 1;
    var availableFrom = $('#availableFrom-'.concat(oldId)).val();
    var availableTo = $('#availableTo-'.concat(oldId)).val();
    availableFrom = Ele.find('td .availableFrom').val();
    availableTo = Ele.find('td .availableTo').val();
    var availableTimeFrom = '';
    var availableTimeTo = '';
    // if (hospitalStartTime[id + 1][0] > availableFrom) {
    //     displayErrorMessage('Hospital Schedule doesn\'t match with Selected Time');
    //     availableTimeFrom = hospitalStartTime[id + 1][0];
    // $('#availableFrom-'.concat(id)).val(hospitalStartTime[id + 1][0] + ':00');
    // } else {
    availableTimeFrom = availableFrom;
    $('#availableFrom-'.concat(id)).val(availableFrom);
    // }
    // if (hospitalStartTime[id + 1][1] > availableTo) {
    //     // availableTimeTo = hospitalStartTime[id + 1][1];
    //     // $('#availableTo-'.concat(id)).
    //     //     val(hospitalStartTime[id + 1][1] + ':00');
    //     availableTimeTo = availableTo;
    //     $('#availableTo-'.concat(id)).val(availableTo);
    // } else {
    availableTimeTo = availableTo;
    $('#availableTo-'.concat(id)).val(availableTo);
    // }
    var newId = id + 1;
    $('.hospitalScheduleFrom-' + newId).flatpickr({
      enableTime: true,
      noCalendar: true,
      enableSeconds: true,
      dateFormat: 'H:i:S',
      time_24hr: true,
      minTime: availableTimeFrom,
      locale: $('.userCurrentLanguage').val()
    });
    $('.hospitalScheduleTo-' + newId).flatpickr({
      enableTime: true,
      noCalendar: true,
      enableSeconds: true,
      dateFormat: 'H:i:S',
      time_24hr: true,
      maxTime: availableTimeTo,
      locale: $('.userCurrentLanguage').val()
    });
  });
  listenSubmit('.editScheduleForm', function (e) {
    e.preventDefault();
    var perPatientTime = $('.perPatientTime').val();
    if (perPatientTime == '00:00:00') {
      $('#scheduleErrorsBox').html('Please select per patient time').show();
      $('.perPatientTime').focus();
      return false;
    }
    var j = 0;
    var availableFrom = true;
    for (j; j <= 6; j++) {
      if ($('#availableFrom-' + j).val() != '00:00:00') {
        availableFrom = false;
        if (hospitalStartTime[j + 1] !== 'undefined' && $('#availableFrom-' + j).val() < hospitalStartTime[j + 1][0]) {
          $('#availableFrom-' + j).focus();
          $('#scheduleErrorsBox').show().html('Available From time must be greater than hospital schedule time').show();
          $('#scheduleErrorsBox').delay(5000).fadeOut();
          return false;
        }
      }
    }
    if (availableFrom) {
      $('#scheduleErrorsBox').show().html('Available From time must be greater than Zero');
      $('#scheduleErrorsBox').delay(5000).fadeOut();
      return false;
    }
    var i = 0;
    var availableTo = true;
    for (i; i <= 6; i++) {
      if ($('#availableTo-' + i).val() != '00:00:00') {
        availableTo = false;
        if (hospitalStartTime[i + 1] !== 'undefined' && $('#availableTo-' + i).val() > hospitalStartTime[i + 1][1] + ':00') {
          $('#availableTo-' + i).focus();
          $('#scheduleErrorsBox').show().html('Available To time must be less than hospital schedule time').show();
          $('#scheduleErrorsBox').delay(5000).fadeOut();
          return false;
        }
      }
    }
    if (availableTo) {
      $('#scheduleErrorsBox').show().html('Available To time must be greater than Zero');
      $('#scheduleErrorsBox').delay(5000).fadeOut();
      return false;
    }
    // $(this)[0].submit()
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/assets/js/services/services.js ***!
  \**************************************************/


document.addEventListener('turbo:load', loadServicesCreateEdit);
function loadServicesCreateEdit() {
  listenChange('#servicesFilterStatus', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  });
  listenClick('#servicesResetFilter', function () {
    $('#servicesFilterStatus').val(0).trigger('change');
    hideDropdownManually($('#servicesFilterBtn'), $('.dropdown-menu'));
  });
}
listenClick('.services-delete-btn', function (event) {
  var serviceId = $(event.currentTarget).attr('data-id');
  deleteItem($('#showServiceReportUrl').val() + '/' + serviceId, '#servicesReportTable', $('#serviceLang').val());
});
listenChange('.service-status', function (event) {
  var serviceId = $(event.currentTarget).attr('data-id');
  updateServiceStatus(serviceId);
});
window.updateServiceStatus = function (id) {
  $.ajax({
    url: $('#showServiceReportUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
        // tbl.ajax.reload(null, false);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************************************!*\
  !*** ./resources/assets/js/services/create-edit.js ***!
  \*****************************************************/


document.addEventListener('turbo:load', loadServicesCreateEdit);
function loadServicesCreateEdit() {
  $('#status').select2({
    width: '100%'
  });
  $('.price-input').trigger('input');
  $(window).on('beforeunload', function () {
    $('input[type=submit]').prop('disabled', 'disabled');
  });
  $('#createServiceForm, #editServiceForm').find('input:text:visible:first').focus();
  listenSubmit('#createServiceForm', function () {
    $('#servicesBtnSave').attr('disabled', true);
  });
  listenSubmit('#editServiceForm', function () {
    $('#editServicesBtnSave').attr('disabled', true);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/assets/js/packages/packages.js ***!
  \**************************************************/


listenClick('.packages-delete-btn', function (event) {
  var packageId = $(event.currentTarget).attr('data-id');
  deleteItem($('.packageReportUrl').val() + '/' + packageId, '#packagesReportTable', $('#packageLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*****************************************************!*\
  !*** ./resources/assets/js/packages/create-edit.js ***!
  \*****************************************************/


document.addEventListener('turbo:load', loadPackagesCreateEdit);
var uniquePackageId = $('.packageUniqueId').val();
var dropdownToPackageSelecte2 = function dropdownToPackageSelecte2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.package.select_service'),
    width: '100%'
  });
};
function loadPackagesCreateEdit() {
  var dropdownToPackageSelecte2 = function dropdownToPackageSelecte2(selector) {
    $(selector).select2({
      placeholder: Lang.get('messages.package.select_service'),
      width: '100%'
    });
  };
  $('#packageForm').find('input:text:visible:first').focus();
  dropdownToPackageSelecte2('.serviceId');
  listenClick('.delete-service-package-item', function () {
    $(this).parents('tr').remove();
    resetServicePackageItemIndex();
    calculateAndSetTotalAmount();
  });
  var removeCommas = function removeCommas(str) {
    return str.replace(/,/g, '');
  };
  window.isNumberKey = function (evt, element) {
    var charCode = evt.which ? evt.which : event.keyCode;
    return !((charCode !== 46 || $(element).val().indexOf('.') !== -1) && (charCode < 48 || charCode > 57));
  };
  listenKeyup('.packages-qty', function () {
    var qty = parseInt($(this).val());
    var rate = $(this).parent().siblings().find('.packages-price').val();
    rate = parseInt(removeCommas(rate));
    var amount = calculateAmount(qty, rate);
    $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
    calculateAndSetTotalAmount();
  });
  listenKeyup('.packages-price', function () {
    var rate = $(this).val();
    rate = parseInt(removeCommas(rate));
    var qty = parseInt($(this).parent().siblings().find('.packages-qty').val());
    var amount = calculateAmount(qty, rate);
    $(this).parent().siblings('.amount').text(addCommas(amount.toString()));
    calculateAndSetTotalAmount();
  });
  listenKeyup('.package-discount', function () {
    calculateAndSetTotalAmount();
  });
  var calculateAmount = function calculateAmount(qty, rate) {
    if (qty > 0 && rate > 0) {
      return qty * rate;
    } else {
      return 0;
    }
  };
  var calculateAndSetTotalAmount = function calculateAndSetTotalAmount() {
    var totalAmount = 0;
    var discount = parseFloat($('.package-discount').val() !== '' ? $('.package-discount').val() : 0);
    $('.package-service-item-container>tr').each(function () {
      var itemTotal = $(this).find('.item-total').text();
      itemTotal = removeCommas(itemTotal);
      itemTotal = isEmpty($.trim(itemTotal)) ? 0 : parseInt(itemTotal);
      totalAmount += itemTotal;
    });
    totalAmount = parseFloat(totalAmount);
    totalAmount -= totalAmount * discount / 100;
    $('#packagesTotal').text(addCommas(totalAmount.toFixed(2)));

    //set hidden input value
    $('#packagesTotalAmount').val(totalAmount);
  };
}
listenSubmit('.packageForm', function (event) {
  event.preventDefault();
  screenLock();
  $('#packagesSaveBtn').attr('disabled', true);
  var loadingButton = jQuery(this).find('#packagesSaveBtn');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.packageSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.packageUrl').val();
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#packagesSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      screenUnLock();
      loadingButton.button('reset');
    }
  });
});
listenClick('#packagesAddItem', function () {
  var data = {
    'services': JSON.parse($('.associateServices').val()),
    'uniqueId': uniquePackageId
  };
  var packageServiceItemHtml = prepareTemplateRender('#packageServiceTemplate', data);
  $('.package-service-item-container').append(packageServiceItemHtml);
  dropdownToPackageSelecte2('.serviceId');
  uniquePackageId++;
  resetServicePackageItemIndex();
});
var resetServicePackageItemIndex = function resetServicePackageItemIndex() {
  var index = 1;
  $('.package-service-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      'services': JSON.parse($('.associateServices').val()),
      'uniqueId': uniquePackageId
    };
    var packageServiceItemHtml = prepareTemplateRender('#packageServiceTemplate', data);
    $('.package-service-item-container').append(packageServiceItemHtml);
    dropdownToPackageSelecte2('.serviceId');
    uniquePackageId++;
  }
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/case_handlers/case_handlers.js ***!
  \************************************************************/
listenClick('.case-handler-delete-btn', function (event) {
  var caseHandlerId = $(event.currentTarget).data('id');
  deleteItem($('#indexCaseHandlerUrl').val() + '/' + caseHandlerId, '#caseHandlersTbl', $('#caseHandlerLang').val());
});
listenChange('#caseHandlerHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  hideDropdownManually($('#caseHandlerFilterBtn'), $('#caseHandlerFilter'));
});
listenChange('.case-handler-status', function (event) {
  var caseHandlerId = $(event.currentTarget).data('id');
  updateCaseHandlerStatus(caseHandlerId);
});
listenClick('#caseHandlerResetFilter', function () {
  $('#caseHandlerHead').val(2).trigger('change');
  hideDropdownManually($('#caseHandlerFilterBtn'), $('.dropdown-menu'));
});
window.updateCaseHandlerStatus = function (id) {
  $.ajax({
    url: $('#indexCaseHandlerUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
        // tbl.ajax.reload(null, false)
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/case_handlers/create-edit.js ***!
  \**********************************************************/


document.addEventListener('turbo:load', loadCaseHandlersCreateEdit);
function loadCaseHandlersCreateEdit() {
  if ($('#createCaseHandlerForm').length || $('#editCaseHandlerForm').length) {
    var caseHandlerBirthDateElement = $('#caseHandlerBirthDate');
    var editCaseHandlerBirthDateElement = $('#editCaseHandlerBirthDate');
    var createCaseHandlerFormElement = $('#createCaseHandlerForm');
    var editCaseHandlerFormElement = $('#editCaseHandlerForm');
    if (caseHandlerBirthDateElement.length) {
      $('#caseHandlerBirthDate').flatpickr({
        maxDate: new Date(),
        locale: $('.userCurrentLanguage').val()
      });
    }
    if (editCaseHandlerBirthDateElement.length) {
      $('#editCaseHandlerBirthDate').flatpickr({
        maxDate: new Date(),
        locale: $('.userCurrentLanguage').val()
      });
    }
    if (createCaseHandlerFormElement.length) {
      $('#createCaseHandlerForm').find('input:text:visible:first').focus();
    }
    if (editCaseHandlerFormElement.length) {
      $('#editCaseHandlerForm').find('input:text:visible:first').focus();
    }
  } else {
    return false;
  }
}
listenSubmit('#createCaseHandlerForm, #editCaseHandlerForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
listenClick('.case-andler-remove-image', function () {
  defaultImagePreview('.previewImage', 1);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/patient_cases_list/patient_cases_list.js ***!
  \**********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/employee/notice_boards.js ***!
  \*******************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/advanced_payments/advanced_payments.js ***!
  \********************************************************************/
document.addEventListener('turbo:load', loadAdvancedPaymentData);
function loadAdvancedPaymentData() {}
listenClick('.advanced-payment-delete-btn', function (event) {
  var advancedPaymentId = $(event.currentTarget).attr('data-id');
  deleteItem($('.advancedPaymentURL').val() + '/' + advancedPaymentId, '#advancedPaymentsTable', $('#advancePaymentLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/advanced_payments/create-edit.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadCreateAdvancedPaymentData);
function loadCreateAdvancedPaymentData() {
  $('#advancedPaymentDate').flatpickr({
    defaultDate: new Date(),
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  var editDate = $('#editAdvancedPaymentDate').flatpickr({
    dateFormat: 'Y-m-d',
    locale: $('.userCurrentLanguage').val()
  });
  $('#advancedPaymentPatientId').select2({
    dropdownParent: $('#addNewAdvancedPaymentForm')
  });
  $('#editAdvancedPaymentPatientId').select2({
    dropdownParent: $('#editAdvancedPaymentsForm')
  });
}
listenShownBsModal('#addAdvancedPaymentModal, #editAdvancedPaymentModal', function () {
  $('#advancedPaymentPatientId, #editAdvancedPaymentPatientId:first').focus();
  var receiptNo = Math.random().toString(36).substr(2, 8).toUpperCase();
  $('.advancedPaymentReceiptNo').val(receiptNo);
});
listenSubmit('#addNewAdvancedPaymentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#advancedPaymentBtnSave');
  loadingButton.button('loading');
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: $('.advancePaymentCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $(loadingButton).attr('disabled', false);
        $('#addAdvancedPaymentModal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.advanced-payment-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var advancedPaymentId = $(event.currentTarget).attr('data-id');
  renderAdvancePaymentsData(advancedPaymentId);
});
window.renderAdvancePaymentsData = function (id) {
  $.ajax({
    url: $('.advancedPaymentURL').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#advancePaymentId').val(result.data.id);
        $('#editAdvancedPaymentPatientId').val(result.data.patient_id).trigger('change.select2');
        $('#editAdvancedPaymentReceiptNo').val(result.data.receipt_no);
        $('#editAdvancedPaymentAmount').val(result.data.amount);
        $('.price-input').trigger('input');
        $('#editAdvancedPaymentDate').val(format(result.data.date, 'YYYY-MM-DD'));
        // editDate.setDate(result.data.date)
        $('#editAdvancedPaymentsModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editAdvancedPaymentsForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnAdvancedPaymentEditSave');
  loadingButton.button('loading');
  var id = $('#advancePaymentId').val();
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: $('.advancedPaymentURL').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $(loadingButton).attr('disabled', false);
        $('#editAdvancedPaymentsModal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addNewAdvancedPaymentForm', function () {
  resetModalForm('#addNewAdvancedPaymentForm', '#validationAdvancePaymentErrorsBox');
  $('#advancedPaymentPatientId').val('').trigger('change.select2');
  $('#date').val(moment(new Date()).format('YYYY-MM-DD'));
  $('#advancedPaymentBtnSave').attr('disabled', false);
});
listenHiddenBsModal('#editAdvancedPaymentsModal', function () {
  resetModalForm('#editAdvancedPaymentsForm', '#editPaymentValidationErrorsBox');
  $('#btnAdvancedPaymentEditSave').attr('disabled', false);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************************!*\
  !*** ./resources/assets/js/patient_admissions/patient_admission.js ***!
  \*********************************************************************/
listenClick('.delete-patient-admission-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexPatientAdmissionsUrl').val() + '/' + id, '', $('#patientAdmissionLang').val());
});
listenChange('#patient_admission_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('.patientAdmissionStatus', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  updatePatientAdmissionStatus(id);
});
listenClick('.show-patient-admission-btn', function (event) {
  var patientAdmissionId = $(event.currentTarget).attr('data-id');
  renderPatientAdmissionData(patientAdmissionId);
});
window.renderPatientAdmissionData = function (id) {
  $.ajax({
    url: $('#patientAdmissionsShowModal').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showAdmissionPatient_name').text(result.data.patient.patient_user.full_name);
        $('#showAdmissionDoctor_name').text(result.data.doctor.doctor_user.full_name);
        $('#showAdmission_id').text(result.data.patient_admission_id);
        $('#showAdmission_date').text(result.data.admission_date);
        $('#showAdmissionDischarge_date').text(result.data.discharge_date);
        $('#showAdmissionPackage').text(result.data["package"] ? result.data["package"].name : 'N/A');
        $('#showAdmissionInsurance').text(result.data.insurance ? result.data.insurance.name : 'N/A');
        $('#showAdmission_bed').text(result.data.bed ? result.data.bed.name : 'N/A');
        $('#showAdmissionPolicy_no').text(result.data.policy_no);
        $('#showAdmissionAgent_name').text(result.data.agent_name);
        $('#showAdmissionGuardian_name').text(result.data.guardian_name);
        $('#showAdmissionGuardian_relation').text(result.data.guardian_relation);
        $('#showAdmissionGuardian_contact').text(result.data.guardian_contact);
        $('#showAdmissionGuardian_address').text(result.data.guardian_address);
        $('#showAdmissionPatient_status').empty();
        if (result.data.status == 1) {
          $('#showAdmissionPatient_status').append("<span class=\"badge bg-light-success\">".concat(Lang.get('messages.filter.active'), "</span>"));
        } else {
          $('#showAdmissionPatient_status').append("<span class=\"badge bg-light-danger\">".concat(Lang.get('messages.filter.deactive'), "</span>"));
        }
        $('#showAdmissionCreated_on').text(moment(result.data.created_at).fromNow());
        $('#showAdmissionUpdated_on').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showPatientAdmission').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenClick('#patientAdmissionResetFilter', function () {
  $('#patient_admission_filter_status').val(0).trigger('change');
  hideDropdownManually($('#patientAdmissionFilterBtn'), $('.dropdown-menu'));
});
window.updatePatientAdmissionStatus = function (id) {
  $.ajax({
    url: $('#indexPatientAdmissionsUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
        // tbl.ajax.reload(null, false)
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/patient_admissions/create-edit.js ***!
  \***************************************************************/
document.addEventListener('turbo:load', loadPatientAdmissionData);
var patientAdmissionDate = undefined;
function loadPatientAdmissionData() {
  if (!$('#createPatientAdmission').length && !$('#editPatientAdmission').length) {
    return;
  }
  $('#admissionPatientId, #admissionDoctorId, #admissionPackageId, #admissionInsuranceId, #admissionBedId').select2({
    width: '100%'
  });
  patientAdmissionDate = $('#admissionDate').flatpickr({
    dateFormat: 'Y-m-d H:i',
    sideBySide: true,
    enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
  $('#admissionPatientId').focus();
  if ($('.isEdit').val()) {
    setTimeout(function () {
      $('#admissionDate').trigger('dp.change');
    }, 300);
    var dischargeDate = undefined;
    var patientBirthDate = $('#admissionPatientBirthDate').val();
    $('#admissionDate').flatpickr({
      dateFormat: 'Y-m-d H:i',
      sideBySide: true,
      enableTime: true,
      minDate: patientBirthDate,
      locale: $('.userCurrentLanguage').val(),
      onChange: function onChange(selectedDates, dateStr, instance) {
        var minDate = moment($('#admissionDate').val()).add(1, 'days').format();
        if (typeof dischargeDate != 'undefined') {
          dischargeDate.set('minDate', minDate);
        }
      }
    });
    dischargeDate = $('#admissionDischargeDate').flatpickr({
      dateFormat: 'Y-m-d H:i',
      sideBySide: true,
      minDate: minDate,
      useCurrent: false,
      enableTime: true,
      locale: $('.userCurrentLanguage').val()
    });
    var minDate = moment($('#admissionDate').val()).add(1, 'days').format();
    dischargeDate.set('minDate', minDate);
  }
}
listenSubmit('#createPatientAdmission, #editPatientAdmission', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
listenChange('#admissionPatientId', function (event) {
  var id = $(this).val();
  getPatientAdmissionDate(id);
});
window.getPatientAdmissionDate = function (id) {
  $.ajax({
    url: $('#admissionPatientBirthUrl').val() + '/' + id,
    method: 'get',
    cache: false,
    success: function success(result) {
      patientAdmissionDate.set('minDate', result.user.dob);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************************!*\
  !*** ./resources/assets/js/appointment_calendar/appointment_calendar.js ***!
  \**************************************************************************/


document.addEventListener('turbo:load', loadAppointmentCalender);
function loadAppointmentCalender() {
  if (!$('#calendar').length) {
    return false;
  }
  var patientIdAppointmentElement = $('#patientIdAppointment');
  var doctorIdAppointmentElement = $('#doctorIdAppointment');
  if (patientIdAppointmentElement.length) {
    $('#patientIdAppointment').select2({
      width: '100%',
      dropdownParent: $('#addAppointmentModal')
    });
  }
  if (doctorIdAppointmentElement.length) {
    $('#doctorIdAppointment').select2({
      width: '100%',
      dropdownParent: $('#addAppointmentModal')
    });
  }
  var calendarEl = document.getElementById('calendar');
  if ($('#calendar').length) {
    screenLock();
    $.ajax({
      url: 'calendar-list',
      type: 'GET',
      dataType: 'json',
      success: function success(obj) {
        screenUnLock();
        var calendar = new FullCalendar.Calendar(calendarEl, {
          themeSystem: 'bootstrap5',
          height: 750,
          locale: $('.getLanguage').val(),
          headerToolbar: {
            left: 'title',
            center: 'prev,next today',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          },
          buttonText: {
            today: $('#todayText').val(),
            month: $('#monthText').val(),
            week: $('#weekText').val(),
            day: $('#dayText').val()
          },
          initialDate: new Date(),
          initialView: 'dayGridMonth',
          editable: false,
          selectable: true,
          selectMirror: true,
          timeZone: 'UTC',
          dayMaxEvents: true,
          select: function select(start) {
            $('#opdDateAppointment').val(moment(start.startStr).format('YYYY-MM-DD'));
            var today = moment().format('YYYY-MM-DD');
            if (start.startStr >= today) {
              if ($('#isDoctor').val() != 1) {
                $('#addAppointmentModal').modal('show');
              }
            }
          },
          eventDidMount: function eventDidMount(event, element) {
            $(element).tooltip({
              title: event.title,
              container: 'body'
            });
          },
          events: obj.data,
          eventTimeFormat: {
            hour12: true,
            hour: '2-digit',
            minute: '2-digit'
          },
          loading: function loading(isLoading) {
            if (!isLoading) {
              setTimeout(function () {
                $('#calendar button.fc-today-button').removeClass('disabled').prop('disabled', false);
              }, 100);
            }
          },
          eventClick: function eventClick(e) {
            showAppointmentDetails(e.event.id);
          }
        });
        calendar.render();
      }
    });
  }
}
listenShownBsModal('#addAppointmentModal', function () {
  $('#patientIdAppointment:first').focus();
});
function showAppointmentDetails(appointmentId) {
  $.ajax({
    url: 'appointment-detail' + '/' + appointmentId,
    type: 'GET',
    beforeSend: function beforeSend() {
      screenLock();
    },
    success: function success(data) {
      $('#showPatientName').text(data.data.patient);
      $('#showDepartmentName').text(data.data.department);
      $('#showDoctorName').text(data.data.doctor);
      $('#showOpdDate').text(data.data.opdDate);
      $('#showStatus').text(data.data.status);
      $('#showIsCompleted').text(data.data.is_completed);
      $('#showProblem').text(addNewlines(data.data.problem, 30));
      $('.tooltip ').tooltip('hide');
      $('#appointmentDetailModal').modal('show');
    },
    complete: function complete() {
      screenUnLock();
    }
  });
}
function addNewlines(str, chr) {
  var result = '';
  if (str != null) {
    while (str.length > 0) {
      result += str.substring(0, chr) + '\n';
      str = str.substring(chr);
    }
    return result;
  } else return 'N/A';
}

//parseIn date_time
function parseIn(date_time) {
  var d = new Date();
  d.setHours(date_time.substring(11, 13));
  d.setMinutes(date_time.substring(14, 16));
  return d;
}

//make time slot list
function getTimeIntervals(time1, time2, duration) {
  var arr = [];
  while (time1 < time2) {
    arr.push(time1.toTimeString().substring(0, 5));
    time1.setMinutes(time1.getMinutes() + duration);
  }
  return arr;
}

//slot click change color
var calendersSelectedTime;
listenClick('.time-interval', function (event) {
  var appointmentId = $(event.currentTarget).attr('data-id');
  if ($(this).data('id') == appointmentId) {
    if ($(this).parent().hasClass('booked')) {
      $('.time-slot-book').css('background-color', '#ffa0a0');
    }
  }
  calendersSelectedTime = $(this).text();
  $('.time-slot').removeClass('time-slot-book');
  $(this).parent().addClass('time-slot-book');
});

//create appointment
listenSubmit('#calenderAppointmentForm', function (event) {
  if (calendersSelectedTime == null || calendersSelectedTime == '') {
    $('#calenderAppointmentErrorsBox').show().removeClass('d-none').html(Lang.get('messages.new_change.select_time_slot'));
    $('.alert-danger').delay(5000).slideUp(300, function () {
      $('.alert-danger').attr('style', 'display:none');
    });
    return false;
  }
  event.preventDefault();
  screenLock();
  var formData = $(this).serialize() + '&time=' + calendersSelectedTime;
  $.ajax({
    url: $('#calenderAppointmentSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('#calenderIndexPage').val();
    },
    error: function error(result) {
      printErrorMessage('#calenderAppointmentErrorsBox', result);
      screenUnLock();
    }
  });
});
var calenderDoctorId;
var calenderDoctorChange = false;
var calenderSelectedDate;
var calenderIntervals;
var calenderAlreadyCreateTimeSlot;
listenChange('#doctorIdAppointment', function () {
  if (calenderDoctorChange) {
    $('.error-message').css('display', 'none');
    calenderDoctorChange = true;
  }
  $('.error-message').css('display', 'none');
  calenderDoctorId = $(this).val();
  calenderDoctorChange = true;
  if ($('#opdDateAppointment').val() !== '') {
    $('.doctor-schedule').css('display', 'none');
    $('.error-message').css('display', 'none');
    $('.available-slot-heading').css('display', 'none');
    $('.color-information').css('display', 'none');
    $('.time-slot').remove();
    if ($('#doctorIdAppointment').val() == '') {
      $('#calenderAppointmentErrorsBox').show().html(Lang.get('messages.appointment.please_select_doctor'));
      $('#calenderAppointmentErrorsBox').delay(5000).fadeOut();
      $('#opdDateAppointment').val('');
      $('#opdDateAppointment').data('DateTimePicker').clear();
      return false;
    }
    var weekday = [Lang.get('messages.new_change.sunday'), Lang.get('messages.new_change.monday'), Lang.get('messages.new_change.tuesday'), Lang.get('messages.new_change.wednesday'), Lang.get('messages.new_change.thursday'), Lang.get('messages.new_change.friday'), Lang.get('messages.new_change.saturday')];
    calenderDoctorChange = $('#opdDateAppointment').val();
    var selected = new Date(calenderDoctorChange);
    var dayName = weekday[selected.getDay()];
    //if dayName is blank, then ajax call not run.
    if (dayName == null || dayName == '') {
      return false;
    }

    //get doctor schedule list with time slot.
    $.ajax({
      type: 'GET',
      url: $('#doctorScheduleList').val(),
      data: {
        day_name: dayName,
        doctor_id: calenderDoctorId
      },
      success: function success(result) {
        if (result.success) {
          if (result.data != '') {
            if (result.data.scheduleDay.length != 0) {
              var doctorStartTime = calenderDoctorChange + ' ' + result.data.scheduleDay[0].available_from;
              var doctorEndTime = calenderDoctorChange + ' ' + result.data.scheduleDay[0].available_to;
              var doctorPatientTime = result.data.perPatientTime[0].per_patient_time;

              //perPatientTime convert to Minuter
              var a = doctorPatientTime.split(':'); // split it at the colons
              var minutes = +a[0] * 60 + +a[1]; // convert to minute

              //parse In
              var startTime = parseIn(doctorStartTime);
              var endTime = parseIn(doctorEndTime);

              //call to getTimeIntervals function
              calenderIntervals = getTimeIntervals(startTime, endTime, minutes);

              //if intervals array length is grater then 0 then process
              if (calenderIntervals.length > 0) {
                $('.available-slot-heading').css('display', 'block');
                $('.color-information').css('display', 'block');
                var index;
                var timeStlots = '';
                for (index = 0; index < calenderIntervals.length; ++index) {
                  var data = [{
                    'index': index,
                    'timeSlot': calenderIntervals[index]
                  }];
                  var timeSlot = prepareTemplateRender('#appointmentSlotTemplate', data);
                  timeStlots += timeSlot;
                }
                $('.available-slot').append(timeStlots);
              }

              // display Day Name and time
              if (result.data.scheduleDay[0].available_from != '00:00:00' && result.data.scheduleDay[0].available_to != '00:00:00' && doctorStartTime != doctorEndTime) {
                $('.doctor-schedule').css('display', 'block');
                $('.color-information').css('display', 'block');
                $('.day-name').html(result.data.scheduleDay[0].available_on);
                $('.schedule-time').html('[' + result.data.scheduleDay[0].available_from + ' - ' + result.data.scheduleDay[0].available_to + ']');
              } else {
                $('.doctor-schedule').css('display', 'none');
                $('.color-information').css('display', 'none');
                $('.error-message').css('display', 'block');
                $('.error-message').html(Lang.get('messages.appointment.doctor_schedule_not_available_on_this_date'));
              }
            } else {
              $('.doctor-schedule').css('display', 'none');
              $('.color-information').css('display', 'none');
              $('.error-message').css('display', 'block');
              $('.error-message').html(Lang.get('messages.appointment.doctor_schedule_not_available_on_this_date'));
            }
          }
        }
      }
    });
    if ($('.isCreate').val()) {
      var getCreateTimeSlot = function getCreateTimeSlot() {
        var data = null;
        if ($('.isCreate').val()) {
          data = {
            editSelectedDate: calenderDoctorChange,
            doctor_id: calenderDoctorId
          };
        }
        $.ajax({
          url: $('#getBookingSlot').val(),
          type: 'GET',
          data: data,
          success: function success(result) {
            calenderAlreadyCreateTimeSlot = result.data.bookingSlotArr;
            if (result.data.hasOwnProperty('onlyTime')) {
              if (result.data.bookingSlotArr.length > 0) {
                editTimeSlot = result.data.onlyTime.toString();
                $.each(result.data.bookingSlotArr, function (index, value) {
                  $.each(calenderIntervals, function (i, v) {
                    if (value == v) {
                      $('.time-interval').each(function () {
                        if ($(this).data('id') == i) {
                          if ($(this).html() != editTimeSlot) {
                            $(this).parent().css({
                              'background-color': '#ffa721',
                              'border': '1px solid #ffa721',
                              'color': '#ffffff'
                            });
                            $(this).parent().addClass('booked');
                            $(this).parent().children().prop('disabled', true);
                          }
                        }
                      });
                    }
                  });
                });
              }
              $('.time-interval').each(function () {
                if ($(this).html() == editTimeSlot && result.data.bookingSlotArr.length > 0) {
                  $(this).parent().addClass('time-slot-book');
                  $(this).parent().removeClass('booked');
                  $(this).parent().children().prop('disabled', false);
                  $(this).click();
                }
              });
            } else if (calenderAlreadyCreateTimeSlot.length > 0) {
              $.each(calenderAlreadyCreateTimeSlot, function (index, value) {
                $.each(calenderIntervals, function (i, v) {
                  if (value == v) {
                    $('.time-interval').each(function () {
                      if ($(this).data('id') == i) {
                        $(this).parent().addClass('time-slot-book');
                        $('.time-slot-book').css({
                          'background-color': '#ffa721',
                          'border': '1px solid #ffa721',
                          'color': '#ffffff'
                        });
                        $(this).parent().addClass('booked');
                        $(this).parent().children().prop('disabled', true);
                      }
                    });
                  }
                });
              });
            }
          }
        });
      };
      var delayCall = 200;
      setTimeout(getCreateTimeSlot, delayCall);
    }
  }
});

// reset the modal data after cancel/close
listenHiddenBsModal('#addAppointmentModal', function () {
  resetModalForm('#calenderAppointmentForm', '#calenderAppointmentErrorsBox');
  $('.day-name').html('');
  $('.schedule-time').html('');
  $('.doctor-schedule').css('display', 'none');
  $('.error-message').css('display', 'none');
  $('.available-slot-heading').css('display', 'none');
  $('.available-slot').html('');
  $('.color-information').css('display', 'none');
  calendersSelectedTime = null;
  $('#patientIdAppointment, #doctorIdAppointment').val('').trigger('change.select2');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************!*\
  !*** ./resources/assets/js/enquiry/enquiry.js ***!
  \************************************************/
listenChange('.enquiryStatus', function () {
  var enquiryId = $(this).attr('data-id');
  updateEnquiryStatus(enquiryId);
});
function updateEnquiryStatus(id) {
  $.ajax({
    url: $('#indexEnquiryUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        Livewire.emit('refresh');
      }
    }
  });
}
;
listenClick('#resetEnquiryFilter', function () {
  $('#enquiriesHead').val(2).trigger('change');
  hideDropdownManually($('#enquiriesFilterBtn'), $('.dropdown-menu'));
});
listenChange('#enquiriesHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************************!*\
  !*** ./resources/assets/js/ambulances/ambulances.js ***!
  \******************************************************/


document.addEventListener('turbo:load', loadAmbulances);
function loadAmbulances() {
  listenClick('.ambulances-delete-btn', function (event) {
    var ambulanceId = $(event.currentTarget).attr('data-id');
    deleteItem(route('ambulances.destroy', ambulanceId), '#ambulancesTbl', $('#ambulanceLang').val());
  });
  listenChange('#ambulancesFilterStatus', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  });
  listenClick('#ambulancesResetFilter', function () {
    $('#ambulancesFilterStatus').val(0).trigger('change');
    hideDropdownManually($('#ambulancesFilterBtn'), $('.dropdown-menu'));
  });
}
listenChange('.ambulances-status', function (event) {
  var ambulanceId = $(event.currentTarget).attr('data-id');
  updateIsAvailable(ambulanceId);
});
window.updateIsAvailable = function (id) {
  $.ajax({
    url: route('ambulances.isAvailableAmbulance', id),
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
      }
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!*******************************************************!*\
  !*** ./resources/assets/js/ambulances/create-edit.js ***!
  \*******************************************************/


document.addEventListener('turbo:load', loadAmbulancesCreateEdit);
function loadAmbulancesCreateEdit() {
  $('#ambulancesVehicleType').select2({
    width: '100%'
  });
  listenSubmit('#createAmbulanceForm, #editAmbulanceForm', function () {
    $('#ambulancesBtnSave').attr('disabled', true);
    if ($('#error-msg').text() !== '') {
      $('#phoneNumber').focus();
      $('#ambulancesBtnSave').attr('disabled', false);
      return false;
    }
  });
  $('#createAmbulanceForm, #editAmbulanceForm').find('input:text:visible:first').focus();
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************************************!*\
  !*** ./resources/assets/js/ambulance_call/ambulance_calls.js ***!
  \***************************************************************/


listenClick('.ambulance-call-delete-btn', function (event) {
  var ambulanceCallId = $(event.currentTarget).attr('data-id');
  deleteItem($('#showAmbulanceCallUrl').val() + '/' + ambulanceCallId, '#ambulanceCallsTbl', $('#ambulanceCallLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***********************************************************!*\
  !*** ./resources/assets/js/ambulance_call/create-edit.js ***!
  \***********************************************************/


document.addEventListener('turbo:load', loadAmbulanceCallCreateEdit);
function loadAmbulanceCallCreateEdit() {
  if ($('#createAmbulanceCall').length || $('#editAmbulanceCall').length) {
    var callAmbulanceIdElement = $('#callAmbulanceId');
    var ambulanceCallPatientIdElement = $('#ambulanceCallPatientId');
    var ambulanceCallDateElement = $('#ambulanceCallDate');
    if (callAmbulanceIdElement.length) {
      $('#callAmbulanceId').select2({
        width: '100%'
      });
    }
    if (ambulanceCallPatientIdElement.length) {
      $('#ambulanceCallPatientId').select2({
        width: '100%'
      });
      $('#ambulanceCallPatientId').focus();
    }
    if (ambulanceCallDateElement.length) {
      $('#ambulanceCallDate').flatpickr({
        format: 'YYYY-MM-DD',
        useCurrent: true,
        sideBySide: true,
        locale: $('.userCurrentLanguage').val()
      });
    }
    $('.price-input').trigger('input');
  } else {
    return false;
  }
}
listenChange('#callAmbulanceId', function () {
  $('#ambulanceCallDriverName').val('');
  if (!isEmpty($(this).val())) {
    $.ajax({
      url: $('.getDriverNameUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(result) {
        $('#ambulanceCallDriverName').val(result.data);
      },
      error: function error(result) {
        printErrorMessage('#ambulanceCallValidationErrorsBox', result);
      }
    });
  }
});
listenSubmit('#createAmbulanceCall, #editAmbulanceCall', function () {
  $('#ambulanceCallSaveBtn').attr('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/prescriptions/prescriptions.js ***!
  \************************************************************/
listenClick('.delete-prescription-btn', function (event) {
  var prescriptionId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexPrescriptionUrl').val() + '/' + prescriptionId, '#prescriptionsTable', $('#prescriptionLang').val());
});
listenChange('.prescriptionStatus', function (event) {
  var prescriptionId = $(event.currentTarget).attr('data-id');
  prescriptionUpdateStatus(prescriptionId);
});
function prescriptionUpdateStatus(id) {
  $.ajax({
    url: $('#indexPrescriptionUrl').val() + '/' + +id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        hideDropdownManually($('#prescriptionFilterBtn'), $('#prescriptionFilter'));
      }
    }
  });
}
listenClick('#prescriptionResetFilter', function () {
  $('#prescriptionHead').val('2').trigger('change');
  hideDropdownManually($('#prescriptionFilterBtn'), $('.dropdown-menu'));
});
listenClick('.show-prescription-btn', function (event) {
  event.preventDefault();
  var prescriptionId = event.currentTarget.dataset.id;
  prescriptionRenderData(prescriptionId);
});
function prescriptionRenderData(id) {
  $.ajax({
    url: $('#prescriptionShowModal').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showPrescriptionPatientName').text(result.data.patient.patient_user.full_name);
        $('#showPrescriptionDoctorName').text(result.data.doctor.doctor_user.full_name);
        $('#showPrescriptionFoodAllergies').text(result.data.food_allergies);
        $('#showPrescriptionTendencyBleed').text(result.data.tendency_bleed);
        $('#showPrescriptionHeartDisease').text(result.data.heart_disease);
        $('#showPrescriptionHighBloodPressure').text(result.data.high_blood_pressure);
        $('#showPrescriptionDiabetic').text(result.data.diabetic);
        $('#showPrescriptionSurgery').text(result.data.surgery);
        $('#showPrescriptionAccident').text(result.data.accident);
        $('#showPrescriptionOthers').text(result.data.others);
        $('#showPrescriptionMedicalHistory').text(result.data.medical_history);
        $('#showPrescriptionCurrentMedication').text(result.data.current_medication);
        $('#showPrescriptionFemalePregnancy').text(result.data.female_pregnancy);
        $('#showPrescriptionBreastFeeding').text(result.data.breast_feeding);
        $('#showPrescriptionHealthInsurance').text(result.data.health_insurance);
        $('#showPrescriptionLowIncome').text(result.data.low_income);
        $('#showPrescriptionReference').text(result.data.reference);
        $('#showPrescriptionStatus').empty();
        if (result.data.status == 1) {
          $('#showPrescriptionStatus').append('<span class="badge bg-light-success">' + Lang.get('messages.common.active') + '</span>');
        } else {
          $('#showPrescriptionStatus').append('<span class="badge bg-light-danger">' + Lang.get('messages.filter.deactive') + '</span>');
        }
        $('#showPrescriptionCreatedOn').text(moment(result.data.created_at).fromNow());
        $('#showPrescriptionUpdatedOn').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showPrescription').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
listenChange('#prescriptionHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('.prescriptionMedicineId', function () {
  var medicineId = $(this).val();
  var uniqueId = $(this).attr('data-id');
  $.ajax({
    url: route('get-medicine-quantity', medicineId),
    method: 'get',
    cache: false,
    success: function success(result) {
      if (result.data == null) {
        $(".available-qty-div" + uniqueId).find("small").text("").end().css("margin-top", "0px");
        return false;
      }
      if (result.success) {
        if (result.data.available_quantity <= 10) {
          $('#availableQuantity' + uniqueId).text(Lang.get('messages.item.available_quantity') + ' : ' + result.data.available_quantity).addClass('text-danger').removeClass('text-success');
          $('.available-qty-div').css({
            "margin-top": "22px"
          });
        } else {
          $('#availableQuantity' + uniqueId).text(Lang.get('messages.item.available_quantity') + ' : ' + result.data.available_quantity).addClass('text-success').removeClass('text-danger');
          $('.available-qty-div').css({
            "margin-top": "22px"
          });
        }
      }
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************************!*\
  !*** ./resources/assets/js/patient_prescriptions/patient_prescriptions.js ***!
  \****************************************************************************/
listenChange('#patients_prescription_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#patientPrescriptionResetFilter', function () {
  $('#patients_prescription_filter_status').val(2).trigger('change');
  hideDropdownManually($('#dropdownMenuPrescription'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************************************************!*\
  !*** ./resources/assets/js/patient_prescriptions/create-edit.js ***!
  \******************************************************************/


document.addEventListener('turbo:load', loadPatientPrescriptionDate);
function loadPatientPrescriptionDate() {
  $('#patient_id,#filter_status').select2({
    width: '100%'
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/prescriptions/create-edit.js ***!
  \**********************************************************/
document.addEventListener("turbo:load", loadPrescriptionCreate);
var uniquePrescriptionId = $(".prescriptionUniqueId").val();
function loadPrescriptionCreate() {
  if (!$("#prescriptionPatientId").length && !$("#editPrescriptionPatientId").length) {
    return;
  }
  var prescriptionAddedAtElement = $("#prescriptionAddedAt");
  var editPrescriptionAddedAtElement = $("#editPrescriptionAddedAt");
  $("#prescriptionPatientId,#editPrescriptionPatientId,#filter_status,#prescriptionDoctorId,#editPrescriptionDoctorId,#prescriptionTime,#prescriptionMedicineCategoryId,#prescriptionMedicineBrandId,.prescriptionMedicineId,.prescriptionMedicineMealId,#editPrescriptionTime").select2({
    width: "100%"
  });
  $("#prescriptionMedicineBrandId, #prescriptionMedicineBrandId").select2({
    width: "100%",
    dropdownParent: $("#add_new_medicine")
  });
  $("#prescriptionPatientId,#editPrescriptionPatientId").first().focus();
  if (prescriptionAddedAtElement.length) {
    $("#prescriptionAddedAt").flatpickr({
      maxDate: new Date(),
      locale: $(".userCurrentLanguage").val()
    });
  }
  if (editPrescriptionAddedAtElement.length) {
    $("#editPrescriptionAddedAt").flatpickr({
      maxDate: new Date(),
      locale: $(".userCurrentLanguage").val()
    });
  }
}
listenSubmit("#createPrescription, #editPrescription", function () {
  $(".btnPrescriptionSave").attr("disabled", true);
});
listenSubmit("#createMedicineFromPrescription", function (e) {
  e.preventDefault();
  $.ajax({
    url: $("#createMedicineFromPrescriptionPost").val(),
    method: "POST",
    data: $(this).serialize(),
    success: function success(result) {
      displaySuccessMessage(result.message);
      $("#add_new_medicine").modal("hide");
      $(".medicineTable").load(location.href + " .medicineTable");
    },
    error: function error(result) {
      printErrorMessage("#medicinePrescriptionErrorBox", result);
    }
  });
});
listenHiddenBsModal("#add_new_medicine", function () {
  resetModalForm("#createMedicineFromPrescription", "#medicinePrescriptionErrorBox");
});
var dropdownToSelecte2 = function dropdownToSelecte2(selector) {
  $(selector).select2({
    placeholder: Lang.get("messages.medicine_bills.select_medicine"),
    width: "100%"
  });
};
var dropdownToSelecteDuration2 = function dropdownToSelecteDuration2(selector) {
  $(selector).select2({
    placeholder: Lang.get("messages.new_change.select_duration"),
    width: "100%"
  });
};
var dropdownToSelecteInterVal = function dropdownToSelecteInterVal(selector) {
  $(selector).select2({
    placeholder: Lang.get("messages.new_change.select_dose_interval"),
    width: "100%"
  });
};
listenClick(".delete-prescription-medicine-item", function () {
  $(this).parents("tr").remove();
  // resetPrescriptionMedicineItemIndex()
});
listenClick(".add-medicine-btn", function () {
  var uniquePrescriptionId = $(".prescriptionUniqueId").val();
  var data = {
    medicines: JSON.parse($(".associatePrescriptionMedicines").val()),
    meals: JSON.parse($(".associatePrescriptionMeals").val()),
    doseDuration: JSON.parse($(".DoseDurationId").val()),
    doseInterVal: JSON.parse($(".DoseInterValId").val()),
    uniqueId: uniquePrescriptionId
  };
  var prescriptionMedicineHtml = prepareTemplateRender("#prescriptionMedicineTemplate", data);
  $(".prescription-medicine-container").append(prescriptionMedicineHtml);
  dropdownToSelecte2(".prescriptionMedicineId");
  dropdownToSelecte2(".prescriptionMedicineMealId");
  dropdownToSelecteDuration2(".DoseDurationIdTemplate");
  dropdownToSelecteInterVal(".DoseInterValIdTemplate");
  uniquePrescriptionId++;
  $(".prescriptionUniqueId").val(uniquePrescriptionId);

  // resetPrescriptionMedicineItemIndex();
});
var resetPrescriptionMedicineItemIndex = function resetPrescriptionMedicineItemIndex() {
  var index = 1;
  if (index - 1 == 0) {
    var data = {
      medicines: JSON.parse($(".associatePrescriptionMedicines").val()),
      meals: JSON.parse($(".associatePrescriptionMeals").val()),
      doseDuration: JSON.parse($(".DoseDurationId").val()),
      doseInterVal: JSON.parse($(".DoseInterValId").val()),
      uniqueId: uniquePrescriptionId
    };
    var packageServiceItemHtml = prepareTemplateRender("#prescriptionMedicineTemplate", data);
    $(".prescription-medicine-container").append(packageServiceItemHtml);
    dropdownToSelecte2(".prescriptionMedicineId");
    dropdownToSelecte2(".prescriptionMedicineMealId");
    dropdownToSelecteDuration2(".DoseDurationIdTemplate");
    dropdownToSelecteInterVal(".DoseInterValIdTemplate");
    uniquePrescriptionId++;
  }
};

// listenKeyup('.prescription-dose',function (){

//     $.ajax({
//             type: 'get',
//             url: route('get-medicine',medicineId),
//             success: function (result) {
//                 $(salePriceId).val(result.data.selling_price.toFixed(2))
//                 $(buyPriceId).val(result.data.buying_price.toFixed(2))
//             },
//         });
//     });
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************!*\
  !*** ./resources/assets/js/employee/patient_admission.js ***!
  \***********************************************************/
listenClick('#admissionResetFilter', function () {
  $('#patient_admission_filter_status').val(2).trigger('change');
  hideDropdownManually('.dropdown-menu,#dropdownMenuButton1');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/assets/js/employee/invoice.js ***!
  \*************************************************/
$('#invoice_status_filter').select2({
  width: '100%'
});
$(document).on('click', '#invoiceResetFilter', function () {
  $('#invoice_status_filter').val(2).trigger('change');
  hideDropdownManually('.dropdown-menu,#dropdownMenuButton1');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************!*\
  !*** ./resources/assets/js/employee/bill.js ***!
  \**********************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************************!*\
  !*** ./resources/assets/js/charge_categories/charge_categories.js ***!
  \********************************************************************/


listenClick('.charge-category-delete-btn', function (event) {
  var chargeCategoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('#chargeCategoryURLID').val() + '/' + chargeCategoryId, '#chargeCategoriesTbl', $('#chargeCategoryLang').val());
});
document.addEventListener('success', function (data) {
  displaySuccessMessage(data.detail);
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************!*\
  !*** ./resources/assets/js/charge_categories/create-edit.js ***!
  \**************************************************************/


document.addEventListener('turbo:load', loadChargeCategoryCreateEdit);
function loadChargeCategoryCreateEdit() {
  if (!$('#addChargeCategoryForm').length && !$('#editChargeCategoryForm').length) {
    return false;
  }
  var chargeCategoryTypeIdElement = $('#chargeCategoryTypeId');
  var editChargeCategoryTypeIdElement = $('#editChargeCategoryTypeId');
  if (chargeCategoryTypeIdElement.length) {
    $('#chargeCategoryTypeId').select2({
      width: '100%',
      dropdownParent: $('#add_charge_categories_modal')
    });
  }
  if (editChargeCategoryTypeIdElement.length) {
    $('#editChargeCategoryTypeId').select2({
      width: '100%',
      dropdownParent: $('#edit_charge_categories_modal')
    });
  }
}
listenSubmit('#addChargeCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#chargeCategorySave');
  loadingButton.button('loading');
  $.ajax({
    url: $('.chargeCategoryCreateURLID').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_charge_categories_modal').modal('hide');
        // $('#chargeCategoriesTbl').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#chargeCategoryErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.charge-category-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var chargeTypeId = $(event.currentTarget).attr('data-id');
  renderChargeCategoryData(chargeTypeId);
});
function renderChargeCategoryData(id) {
  $.ajax({
    url: $('#chargeCategoryURLID').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#chargeCatId').val(result.data.id);
        $('#editChargeCategoryName').val(result.data.name);
        $('#editChargeCategoryTypeId').val(result.data.charge_type).trigger('change.select2');
        $('#editChargeCategoryDescription').val(result.data.description);
        $('#edit_charge_categories_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editChargeCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editChargeCategorySave');
  loadingButton.button('loading');
  var id = $('#chargeCatId').val();
  $.ajax({
    url: $('#chargeCategoryURLID').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_charge_categories_modal').modal('hide');
        // $('#chargeCategoriesTbl').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_charge_categories_modal', function () {
  resetModalForm('#addChargeCategoryForm', '#chargeCategoryErrorsBox');
  $('#chargeCategoryTypeId').val('').trigger('change.select2');
});
listenHiddenBsModal('#edit_charge_categories_modal', function () {
  resetModalForm('#editChargeCategoryForm', '#editChargeCategoryErrorsBox');
  $('#editChargeCategoryTypeId').val('').trigger('change.select2');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************!*\
  !*** ./resources/assets/js/charges/charges.js ***!
  \************************************************/


listen('click', '#chargesResetFilter', function () {
  $('#filterChargeType').val(0).trigger('change');
  hideDropdownManually($('#ChargeFilterBtn'), $('.dropdown-menu'));
});
listen('click', '.charge-delete-btn', function (event) {
  var chargeId = $(event.currentTarget).attr('data-id');
  deleteItem($('.chargesURl').val() + '/' + chargeId, '#chargesTbl', $('#chargeLang').val());
});
listenChange('#filterChargeType', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************!*\
  !*** ./resources/assets/js/charges/create-edit.js ***!
  \****************************************************/


document.addEventListener('turbo:load', loadChargeCreateEdit);
function loadChargeCreateEdit() {
  if (!$('#addChargesForm').length && !$('#editChargesForm').length) {
    return false;
  }
  var chargeTypeIdElement = $('#chargeTypeId');
  var chargeCategoryIdElement = $('#chargeCategoryId');
  var editChargeTypeIdElement = $('#editChargeTypeId');
  var editChargeCategoryIdElement = $('#editChargeCategoryId');
  if (chargeTypeIdElement.length) {
    $('#chargeTypeId').select2({
      width: '100%',
      dropdownParent: $('#add_charges_modal'),
      placeholder: Lang.get('messages.charge_category.select_charge_type')
    });
  }
  if (chargeCategoryIdElement.length) {
    $('#chargeCategoryId').select2({
      width: '100%',
      dropdownParent: $('#add_charges_modal'),
      placeholder: Lang.get('messages.pathology_category.select_charge_category')
    });
  }
  if (editChargeTypeIdElement.length) {
    $('#editChargeTypeId').select2({
      width: '100%',
      dropdownParent: $('#edit_charges_modal'),
      placeholder: Lang.get('messages.charge_category.select_charge_type')
    });
  }
  if (editChargeCategoryIdElement.length) {
    $('#editChargeCategoryId').select2({
      width: '100%',
      dropdownParent: $('#edit_charges_modal'),
      placeholder: Lang.get('messages.pathology_category.select_charge_category')
    });
  }
}
listenShownBsModal('#add_charges_modal, #edit_charges_modal', function () {
  $('#chargeTypeId, #editChargeTypeId:first').focus();
});
function changeChargeCategory(selector, id) {
  $.ajax({
    url: $('.changeChargeTypeURL').val(),
    type: 'get',
    dataType: 'json',
    data: {
      id: id
    },
    success: function success(data) {
      $(selector).empty();
      $.each(data.data, function (i, v) {
        $(selector).append($('<option></option>').attr('value', i).text(v));
      });
    }
  });
}
listenChange('#chargeTypeId', function () {
  changeChargeCategory('#chargeCategoryId', $(this).val());
});
listenChange('#editChargeTypeId', function () {
  changeChargeCategory('#editChargeCategoryId', $(this).val());
});
listenSubmit('#addChargesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#chargesSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#createChargesURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_charges_modal').modal('hide');
        // $('#chargesTbl').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#chargesErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.charge-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var chargeId = $(event.currentTarget).attr('data-id');
  renderChargeData(chargeId);
});
function renderChargeData(id) {
  $.ajax({
    url: $('.chargesURl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#chargeId').val(result.data.id);
        $('#editChargeTypeId').val(result.data.charge_type).trigger('change.select2');
        changeChargeCategory('#editChargeCategoryId', result.data.charge_type);
        $('#editCode').val(result.data.code);
        $('#editChargesDescription').val(result.data.description);
        $('#editStdCharge').val(addCommas(result.data.standard_charge));
        setTimeout(function () {
          $('#editChargeCategoryId').val(result.data.charge_category_id).trigger('change.select2');
        }, 2000);
        $('#edit_charges_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editChargesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editChargesSave');
  loadingButton.button('loading');
  var id = $('#chargeId').val();
  $.ajax({
    url: $('.chargesURl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_charges_modal').modal('hide');
        // $('#chargesTbl').DataTable().ajax.reload(null, false);
        if ($('#chargeDetailShowUrl').length) {
          window.location.href = $('#chargeDetailShowUrl').val();
        } else {
          livewire.emit('refresh');
        }
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_charges_modal', function () {
  resetModalForm('#addChargesForm', '#chargesErrorsBox');
  $('#chargeTypeId,#chargeCategoryId').val('').trigger('change.select2');
});
listenHiddenBsModal('#edit_charges_modal', function () {
  resetModalForm('#editChargesForm', '#editChargesErrorsBox');
  $('#editChargeTypeId,#editChargeCategoryId').val('').trigger('change.select2');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************************!*\
  !*** ./resources/assets/js/radiology_categories/radiology_categories.js ***!
  \**************************************************************************/


listenSubmit('#addRadiologyCatNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnRdSave');
  loadingButton.button('loading');
  $('#btnRdSave').attr('disabled', true);
  $.ajax({
    url: $('#createRadiologyCategoryURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addRadiologyCatModal').modal('hide');
        window.livewire.emit('refresh');
        $('#btnRdSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#rdValidationErrorsBox', result);
      $('#btnRdSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editRadiologyCatForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditRdSave');
  loadingButton.button('loading');
  $('#btnEditRdSave').attr('disabled', true);
  var id = $('#radiologyCategoryId').val();
  $.ajax({
    url: $('#radiologyCategoryURL').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editRadiologyCatModal').modal('hide');
        window.livewire.emit('refresh');
        $('#btnEditRdSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#btnEditRdSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addRadiologyCatModal', function () {
  resetModalForm('#addRadiologyCatNewForm', '#rdValidationErrorsBox');
  $('#btnRdSave').attr('disabled', false);
});
listenHiddenBsModal('#editRadiologyCatModal', function () {
  resetModalForm('#editRadiologyCatForm', '#editRdValidationErrorsBox');
  $('#btnEditRdSave').attr('disabled', false);
});
window.renderRadiologyCatData = function (id) {
  $.ajax({
    url: $('#radiologyCategoryURL').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var radiologyCategory = result.data;
        $('#radiologyCategoryId').val(radiologyCategory.id);
        $('#editRadiologyCatName').val(radiologyCategory.name);
        $('#editRadiologyCatModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenClick('.edit-radiology-cat-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var radiologyCategoryId = $(event.currentTarget).attr('data-id');
  renderRadiologyCatData(radiologyCategoryId);
});
listenClick('.delete-radiology-cat-btn', function (event) {
  var radiologyCategoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('#radiologyCategoryURL').val() + '/' + radiologyCategoryId, '#radiologyCategoryTable', $('#radiologyCategoryLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************************!*\
  !*** ./resources/assets/js/pathology_categories/pathology_categories.js ***!
  \**************************************************************************/


listenSubmit('#addPathologyCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#pathologyCategorySave');
  loadingButton.button('loading');
  $('#pathologyCategorySave').attr('disabled', true);
  $.ajax({
    url: $('#createPathologyCategoryURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addPathologyCategoriesModal').modal('hide');
        window.livewire.emit('refresh');
        $('#pathologyCategorySave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#pCatValidationErrorsBox', result);
      $('#pathologyCategorySave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editPathologyCategoriesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editPathologyCategorySaveBtn');
  loadingButton.button('loading');
  var id = $('#pathologyCategoryId').val();
  $('#editPathologyCategorySaveBtn').attr('disabled', true);
  $.ajax({
    url: $('#pathologyCategoryURL').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editPathologyCategoriesModal').modal('hide');
        window.livewire.emit('refresh');
        $('#editPathologyCategorySaveBtn').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#editPathologyCategorySaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addPathologyCategoriesModal', function () {
  resetModalForm('#addPathologyCategoryForm', '#pCatValidationErrorsBox');
  $('#pathologyCategorySave').attr('disabled', false);
});
listenHiddenBsModal('#editPathologyCategoriesModal', function () {
  resetModalForm('#editPathologyCategoriesForm', '#editPCatValidationErrorsBox');
  $('#editPathologyCategorySaveBtn').attr('disabled', false);
});
window.renderPathologyData = function (id) {
  $.ajax({
    url: $('#pathologyCategoryURL').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var pathologyCategory = result.data;
        $('#pathologyCategoryId').val(pathologyCategory.id);
        $('#editPathologyCategoryName').val(pathologyCategory.name);
        $('#editPathologyCategoriesModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenClick('.edit-pathology-category-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var pathologyCategoryId = $(event.currentTarget).attr('data-id');
  renderPathologyData(pathologyCategoryId);
});
listenClick('.delete-pathology-category-btn', function (event) {
  var pathologyCategoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('#pathologyCategoryURL').val() + '/' + pathologyCategoryId, '#pathologyCategoryTable', $('#pathologyCategoryLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************!*\
  !*** ./resources/assets/js/radiology_tests/radiology_tests.js ***!
  \****************************************************************/


listenClick('.delete-radiology-test-btn', function (event) {
  var radiologyTestId = $(event.currentTarget).attr('data-id');
  deleteItem($('#radiologyTestURL').val() + '/' + radiologyTestId, '#radiologyTestsTable', $('#radiologyTestLang').val());
});
listenClick('.show-radiology-test-btn', function (event) {
  var radiologyTestId = $(event.currentTarget).attr('data-id');
  renderRadiologyTestData(radiologyTestId);
});
window.renderRadiologyTestData = function (id) {
  $.ajax({
    url: route('radiology.test.show.modal', id),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#radiologyTestName').text(result.data.test_name);
        $('#radiologyTestShortName').text(result.data.short_name);
        $('#radiologyTestType').text(result.data.test_type);
        $('#radiologyTestCategoryName').text(result.data.radiologycategory.name);
        $('#radiologyTestSubCategory').text(result.data.subcategory);
        $('#radiologyTestReportDays').text(result.data.report_days);
        $('#radiologyTestChargeCategory').text(result.data.chargecategory.name);
        $('#radiologyTestStandardCharge').text(result.data.standard_charge);
        $('#radiologyTestCreatedOn').text(moment(result.data.created_at).fromNow());
        $('#radiologyTestUpdatedOn').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showRadiologyTest').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/radiology_tests/create-edit.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadRadiologyTestCreateEditData);
function loadRadiologyTestCreateEditData() {
  $('.price-input').trigger('input');
  $('#radiologyCategories,#chargeCategory,#editCategoryName,#editChargeCategory,#chargeCode').select2({
    width: '100%'
  });
}
$('#createRadiologyTest, #editRadiologyTest').find('input:text:visible:first').focus();
listen('change', '.charge-category', function (event) {
  var chargeCategoryId = $(this).val();
  chargeCategoryId !== '' ? getRadiologyChargeCode(chargeCategoryId) : $('#chargeCode').empty(), $('#chargeCode').attr('disabled', true), $('#chargeCode').append($('<option></option>').text(Lang.get('messages.new_change.select_charge'))), $(".rd-test-standard-charge").val('');
});
window.getRadiologyChargeCode = function (id) {
  $.ajax({
    url: $('.radiology-test-url').val() + '/get-charge-code' + '/' + id,
    method: 'get',
    cache: false,
    success: function success(result) {
      if (result.data !== '') {
        $('#chargeCode').empty();
        $('#chargeCode').removeAttr('disabled');
        $('#chargeCode').append($('<option></option>').text(Lang.get('messages.new_change.select_charge')));
        $.each(result.data, function (i, v) {
          $('#chargeCode').append($('<option></option>').attr('value', i).text(v));
        });
      } else {
        $('#chargeCode').append($('<option></option>').text(Lang.get('messages.new_change.select_charge')));
      }
    }
  });
};
listen('change', '.charge-code', function (event) {
  var chargeId = $(this).val();
  chargeId !== '' ? getRadiologyStandardCharge(chargeId) : $('.rd-test-standard-charge').val('');
});
window.getRadiologyStandardCharge = function (id) {
  $.ajax({
    url: $('.radiology-test-url').val() + '/get-standard-charge' + '/' + id,
    method: 'get',
    cache: false,
    success: function success(result) {
      if (result !== '') {
        $('.rd-test-standard-charge').val(result.data);
        $('.price-input').trigger('input');
      }
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/doctor_opd_charges/doctor_opd_charges.js ***!
  \**********************************************************************/
document.addEventListener('turbo:load', loadDoctorOpdChargeCreateEdit);
function loadDoctorOpdChargeCreateEdit() {
  if (!$('#addDoctorChargesForm').length && !$('#editDoctorChargesForm').length) {
    return false;
  }
  var chargesDoctorIdElement = $('#chargesDoctorId');
  var editChargesDoctorIdElement = $('#editChargesDoctorId');
  if (chargesDoctorIdElement.length) {
    $('#chargesDoctorId').select2({
      width: '100%',
      dropdownParent: $('#add_doctor_opd_charges_modal')
    });
  }
  if (editChargesDoctorIdElement.length) {
    $('#editChargesDoctorId').select2({
      width: '100%',
      dropdownParent: $('#edit_doctor_opd_charges_modal')
    });
  }
}
listenSubmit('#addDoctorChargesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#doctorChargesSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#doctorOPDCreateChargeURLID').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_doctor_opd_charges_modal').modal('hide');
        // tbl.ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#doctorChargesErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.doctor-opd-charge-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#doctorOPDChargeURLID').val() + '/' + id, null, $('#doctorOpdChargeLang').val());
});
listenClick('.doctor-opd-charge-edit-btn', function (event) {
  var doctorOPDChargeId = $(event.currentTarget).attr('data-id');
  renderDoctorOpdChargeData(doctorOPDChargeId);
});
function renderDoctorOpdChargeData(id) {
  $.ajax({
    url: $('#doctorOPDChargeURLID').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#doctorOPDChargeId').val(result.data.id);
        $('#editChargesDoctorId').val(result.data.doctor_id).trigger('change.select2');
        $('#editDoctorStandardCharge').val(result.data.standard_charge);
        $('.price-input').trigger('input');
        $('#edit_doctor_opd_charges_modal').modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editDoctorChargesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editDoctorChargesSave');
  loadingButton.button('loading');
  var id = $('#doctorOPDChargeId').val();
  $.ajax({
    url: $('#doctorOPDChargeURLID').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_doctor_opd_charges_modal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_doctor_opd_charges_modal', function () {
  resetModalForm('#addDoctorChargesForm', '#doctorChargesErrorsBox');
  $('#chargesDoctorId').val('').trigger('change.select2');
});
listenHiddenBsModal('#edit_doctor_opd_charges_modal', function () {
  resetModalForm('#editDoctorChargesForm', '#editDoctorChargesErrorsBox');
});
listenShownBsModal('#add_doctor_opd_charges_modal, #edit_doctor_opd_charges_modal', function () {
  $('#chargesdoctorId, #editChargesDoctorId:first').focus();
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************!*\
  !*** ./resources/assets/js/pathology_tests/pathology_tests.js ***!
  \****************************************************************/


listenClick(".delete-pathology-test-btn", function (event) {
  var pathologyTestId = $(event.currentTarget).attr("data-id");
  deleteItem($("#pathologyTestURL").val() + "/" + pathologyTestId, "#pathologyTestsTable", $("#pathologyTestLang").val());
});
listenClick(".show-pathology-test-btn", function (event) {
  var pathologyTestId = $(event.currentTarget).attr("data-id");
  renderShowPathologyData(pathologyTestId);
});
window.renderShowPathologyData = function (id) {
  $.ajax({
    url: route("pathology.test.show.modal", id),
    type: "GET",
    success: function success(result) {
      if (result.success) {
        $("#showPathologyTestName").text(result.data.test_name);
        $("#showPathologyTestShortName").text(result.data.short_name);
        $("#showPathologyTestType").text(result.data.test_type);
        $("#showPathologyCategories").text(result.data.pathologycategory.name);
        $("#showPathologyTestUnit").text(result.data.unit);
        $("#showPathologyTestSubcategory").text(result.data.subcategory);
        $("#showPathologyTestMethod").text(result.data.method);
        $("#showPathologyTestReportDays").text(result.data.report_days);
        $("#showPathologyChargeCategories").text(result.data.chargecategory.name);
        $("#showPTestStandardCharge").text(result.data.standard_charge);
        $("#showPathologyTestCreatedOn").text(moment(result.data.created_at).fromNow());
        $("#showPathologyTestUpdatedOn").text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $("#showPathologyTest").appendTo("body").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenChange(".patholory-parameter-data", function () {
  var parameterId = $(this).val();
  var currentRow = $(this).closest("tr");
  var rangeId = currentRow.find("#rangeId");
  var unitId = currentRow.find("#unitId");
  if (parameterId == "") {
    $(rangeId).val("");
    $(unitId).val("");
    return false;
  }
  $.ajax({
    type: "get",
    url: route("get-pathology-parameter", parameterId),
    success: function success(result) {
      $(rangeId).val(result.data.parameter.reference_range);
      $(unitId).val(result.data.parameter.pathology_unit.name);
    }
  });
});
listenClick(".add-parameter-test", function () {
  var uniqueParameterId = $("#parameterUniqueId").val();
  var data = {
    parameters: JSON.parse($(".associateParameters").val()),
    uniqueId: uniqueParameterId
  };
  var pathologyParameterHtml = prepareTemplateRender("#pathologyParameterTemplate", data);
  $(".pathology-test-container").append(pathologyParameterHtml);
  dropdownToSelecte2(".patholory-parameter-data");
  uniqueParameterId++;
});
var dropdownToSelecte2 = function dropdownToSelecte2(selector) {
  $(selector).select2({
    placeholder: Lang.get('messages.new_change.select_parameter_name'),
    width: "100%"
  });
};
listenClick(".delete-parameter-test", function () {
  $(this).parents("tr").remove();
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************!*\
  !*** ./resources/assets/js/pathology_tests/create-edit.js ***!
  \************************************************************/


document.addEventListener('turbo:load', loadPathologyTestData);
function loadPathologyTestData() {
  $('.price-input').trigger('input');
  $('.pathologyCategories,.pChargeCategories').select2({
    width: '100%'
  });
}
$('#createPathologyTest, #editPathologyTest').find('input:text:visible:first').focus();
listenChange('.pChargeCategories', function (event) {
  var chargeCategoryId = $(this).val();
  chargeCategoryId !== '' ? getStandardCharge(chargeCategoryId) : $('.pathologyStandardCharge').val('');
});
window.getStandardCharge = function (id) {
  $.ajax({
    url: $('.pathologyTestActionURL').val() + '/get-standard-charge' + '/' + id,
    method: 'get',
    cache: false,
    success: function success(result) {
      if (result !== '') {
        $('.pathologyStandardCharge').val(result.data);
        $('.price-input').trigger('input');
      }
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/assets/js/expenses/expenses.js ***!
  \**************************************************/
document.addEventListener('turbo:load', loadExpense);
function loadExpense() {
  if (!$('#indexExpenseUrl').length) {
    return;
  }
  $('#expenseDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val()
  });
  var editDate = $('#editExpenseDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val()
  });
  $('#expenseHead').select2({
    width: '100%'
  });
  $('#expenseId').select2({
    width: '100%',
    dropdownParent: $('#add_expenses_modal')
  });
  $('#editExpenseHeadId').select2({
    width: '100%',
    dropdownParent: $('#edit_expenses_modal')
  });
  listenShownBsModal('#add_expenses_modal, #edit_expenses_modal', function () {
    $('#expenseId, #editExpenseHeadId:first').focus();
    $('#expenseId').select2({
      width: '100%',
      dropdownParent: $('#add_expenses_modal')
    });
    $('#editExpenseHeadId').select2({
      width: '100%',
      dropdownParent: $('#edit_expenses_modal')
    });
  });
}
listenClick('.deleteExpenseBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexExpenseUrl').val() + '/' + id, expensesTable, $('#expenseLang').val());
});
listenClick('.editExpensesBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var expenseId = $(event.currentTarget).attr('data-id');
  renderExpenseData(expenseId);
});
function renderExpenseData(id) {
  $.ajax({
    url: $('#indexExpenseUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          // $('#editPreviewImage').attr('src', $('.pdfDocumentImageUrl').val());
          $('#editExpensePreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editExpensePreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else if (ext == '') {
          $('#editExpensePreviewImage').css('background-image', 'url("' + $('#indexExpenseDefaultDocumentImageUrl').val() + '")');
        } else {
          $('#editExpensePreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
        }
        $('#editExpenseId').val(result.data.id);
        $('#editExpenseHeadId').val(result.data.expense_head).trigger('change.select2');
        $('#editExpenseName').val(result.data.name);
        document.querySelector('#editExpenseDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editExpenseInvoiceNumber').val(result.data.invoice_number);
        $('#editExpenseAmount').val(result.data.amount);
        $('.price-input').trigger('input');
        $('#editExpenseDescription').val(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#expenseDocumentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#expenseDocumentUrl').show();
          $('.btn-view').show();
          $('#expenseDocumentUrl').attr('href', result.data.document_url);
        }
        $('#edit_expenses_modal').appendTo('body').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#addExpenseForm', function (event) {
  event.preventDefault();
  $('#expenseSave').attr('disabled', true);
  var loginButton = jQuery(this).find('#expenseSave');
  loginButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#indexExpenseCreateUrl').val(),
    'type': 'POST',
    'tableSelector': expensesTable
  };
  newRecord(data, loginButton, '#add_expenses_modal');
});
var expensesTable = '#expensesTable';
listenSubmit('#editExpensesForm', function (event) {
  event.preventDefault();
  $('#editExpenseSave').attr('disabled', true);
  var loadingButton = jQuery(this).find('#editExpenseSave');
  loadingButton.button('loading');
  var id = $('#editExpenseId').val();
  var url = $('#indexExpenseUrl').val() + '/' + id + '/update';
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST',
    'tableSelector': expensesTable
  };
  Livewire.emit('refresh');
  editRecord(data, loadingButton, '#edit_expenses_modal');
});
listenClick('#ExpenseResetFilter', function () {
  $('#expenseHead').val(0).trigger('change');
  hideDropdownManually($('#ExpenseFilterBtn'), $('.dropdown-menu'));
});
listenHiddenBsModal('#add_expenses_modal', function () {
  resetModalForm('#addExpenseForm', '#expenseErrorsBox');
  $('#expenseSave').attr('disabled', false);
  $('#expenseId').val('').trigger('change.select2');
  $('#expensePreviewImage').css('background-image', 'url(' + $('#indexExpenseDefaultDocumentImageUrl').val() + ')');
});
listenHiddenBsModal('#edit_expenses_modal', function () {
  $('#editExpenseSave').attr('disabled', false);
  resetModalForm('#editExpensesForm', '#editExpenseErrorsBox');
});
listenChange('#expenseAttachment', function () {
  var extension = isValidExpenseDocument($(this), '#expenseErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#expenseErrorsBox').html('').hide();
    displayDocument(this, '#expensePreviewImage', extension);
  }
});
listenChange('#editExpenseAttachment', function () {
  var extension = isValidExpenseDocument($(this), '#editExpenseErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editExpenseErrorsBox').html('').hide();
    displayDocument(this, '#editExpensePreviewImage', extension);
  }
});
function isValidExpenseDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html($('#indexExpenseDocumentError').val()).show();
    return false;
  }
  return ext;
}
;
listenClick('.removeExpenseImage', function () {
  defaultImagePreview('#expensePreviewImage');
});
listenClick('.removeExpenseImageEdit', function () {
  defaultImagePreview('#editExpensePreviewImage');
});
listenChange('#expenseHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************!*\
  !*** ./resources/assets/js/incomes/incomes.js ***!
  \************************************************/
document.addEventListener('turbo:load', loadIncome);
function loadIncome() {
  if (!$('#addIncomeForm').length && !$('#editIncomesForm').length) {
    return;
  }
  listenShownBsModal('#add_incomes_modal, #edit_incomes_modal', function () {
    $('#incomeId, #editIncomeHeadId:first').focus();
    $('#incomeId').select2({
      width: '100%',
      dropdownParent: $('#add_incomes_modal')
    });
    $('#editIncomeHeadId').select2({
      width: '100%',
      dropdownParent: $('#edit_incomes_modal')
    });
  });
  $('#incomeHead').select2({
    width: '100%'
  });
  $('#incomeDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: false,
    locale: $('.userCurrentLanguage').val()
  });
  var editDate = $('#editIncomeDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: false,
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#addIncomeForm', function (event) {
  event.preventDefault();
  $('#incomeSave').attr('disabled', true);
  var loginButton = jQuery(this).find('#incomeSave');
  loginButton.button('loading');
  $.ajax({
    url: $('#indexIncomeCreateUrl').val(),
    type: 'POST',
    data: new FormData(this),
    dataType: 'JSON',
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_incomes_modal').modal('hide');
        $('#incomeSave').attr('disabled', false);
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      $('#incomeSave').attr('disabled', false);
      printErrorMessage('#incomeErrorsBox', result);
    },
    complete: function complete() {
      loginButton.button('reset');
    }
  });
});
listenClick('.deleteIncomesBtn', function (event) {
  var deleteIncomeId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexIncomeUrl').val() + '/' + deleteIncomeId, null, $('#incomeLang').val());
});
listenClick('#incomeResetFilter', function () {
  $('#incomeHead').val(0).trigger('change');
  hideDropdownManually($('#incomeFilterBtn'), $('.dropdown-menu'));
});
listenClick('.editIncomesBtn', function (event) {
  var id = event.currentTarget.dataset.id;
  renderIncomeData(id);
});
function renderIncomeData(id) {
  $.ajax({
    url: $('#indexIncomeUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          // $('#editPreviewImage').attr('src', $('.pdfDocumentImageUrl').val());
          $('#editIncomePreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editIncomePreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else if (ext == '') {
          $('#editIncomePreviewImage').css('background-image', 'url("' + $('#indexIncomeDefaultDocumentImageUrl').val() + '")');
        } else {
          $('#editIncomePreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
        }
        $('#editIncomeId').val(result.data.id);
        $('#editIncomeHeadId').val(result.data.income_head).trigger('change.select2');
        $('#editIncomeName').val(result.data.name);
        document.querySelector('#editIncomeDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editIncomeInvoiceNumber').val(result.data.invoice_number);
        $('#editIncomeAmount').val(result.data.amount);
        $('.price-input').trigger('input');
        $('#editIncomeDescription').val(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#editIncomeDocumentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#editIncomeDocumentUrl').show();
          $('.btn-view').show();
          $('#editIncomeDocumentUrl').attr('href', result.data.document_url);
        }
        $('#edit_incomes_modal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editIncomesForm', function (event) {
  event.preventDefault();
  $('#editIncomeSave').attr('disabled', true);
  var loadingButton = jQuery(this).find('#editIncomeSave');
  loadingButton.button('loading');
  var id = $('#editIncomeId').val();
  var url = $('#indexIncomeUrl').val() + '/' + id + '/update';
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST',
    'tableSelector': null
  };
  Livewire.emit('refresh');
  editRecord(data, loadingButton, '#edit_incomes_modal');
  $('#avatar_remove').val('');
});
listenHiddenBsModal('#add_incomes_modal', function () {
  resetModalForm('#addIncomeForm', '#incomeErrorsBox');
  $('#incomeSave').attr('disabled', false);
  $('#incomeId').val('').trigger('change.select2');
  // $('#previewImage').attr('src', $('#indexIncomeDefaultDocumentImageUrl').val());
  $('#incomePreviewImage').css('background-image', 'url("' + $('#indexIncomeDefaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#edit_incomes_modal', function () {
  resetModalForm('#editIncomesForm', '#editIncomeErrorsBox');
  $('#editIncomeSave').attr('disabled', false);
});
listenChange('#incomeAttachment', function () {
  var extension = isValidIncomeDocument($(this), '#incomeErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#incomeErrorsBox').html('').hide();
    displayDocument(this, '#incomePreviewImage', extension);
  }
});
listenChange('#editIncomeAttachment', function () {
  var extension = isValidIncomeDocument($(this), '#editIncomeErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editIncomeErrorsBox').html('').hide();
    displayDocument(this, '#editIncomePreviewImage', extension);
  }
});
window.isValidIncomeDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html($('#indexIncomeDocumentError').val()).show();
    return false;
  }
  return ext;
};
listenClick('.removeIncomesImage', function () {
  defaultImagePreview('#incomePreviewImage');
});
listenClick('.removeIncomesImageEdit', function () {
  defaultImagePreview('#editIncomePreviewImage');
});
listenChange('#incomeHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************!*\
  !*** ./resources/assets/js/web/plugin.js ***!
  \*******************************************/
//
// $('.lightgallery').lightGallery({
//     mode: 'lg-slide-circular',
//     counter: false
// });
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************!*\
  !*** ./resources/assets/js/sms/sms.js ***!
  \****************************************/


document.addEventListener('turbo:load', loadSMSData);
function loadSMSData() {
  $('#userSMSId, #roleSMSId').select2({
    width: '100%',
    dropdownParent: $('#AddSMSModal')
  });
  $('.myclass').hide();
  $('#smsPhoneNumber').prop('required', false);
  $(document).on('click', '.smsNumber', function () {
    if ($('.smsNumber').is(':checked')) {
      $('.myclass').show();
      $('.smsNumber').attr('value', 1);
      $('.role').hide();
      $('#roleSMSId').prop('required', false);
      $('.send').hide();
      $('#userSMSId').prop('required', false);
      $('#smsPhoneNumber').prop('required', true);
    } else {
      $('#userSMSId').prop('required', true);
      $('#smsPhoneNumber').prop('required', false);
      hide();
    }
  });
}
listenClick('.show-sms-btn', function (event) {
  var smsId = $(event.currentTarget).attr('data-id');
  renderSmsData(smsId);
});
window.renderSmsData = function (id) {
  $.ajax({
    url: route('sms.show.modal', id),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#sendTo').text(result.data.user ? result.data.user.full_name : 'N/A');
        $('#userSmsRole').text(result.data.user ? result.data.user.roles[0].name : 'N/A');
        $('#smsPhone').text(result.data.phone_number);
        $('#sendBy').text(result.data.send_by ? result.data.send_by.full_name : 'N/A');
        $('#high_blood_pressure').text(result.data.high_blood_pressure);
        $('#smsMessage').text(result.data.message);
        $('#smsDate').text(moment(result.data.created_at).fromNow());
        $('#smsUpdatedOn').text(moment(result.data.updated_at).fromNow());
        setValueOfEmptySpan();
        $('#showSms').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listen('keypress', '#messageId', function (e) {
  var tval = $('#messageId').val(),
    tlength = tval.length,
    set = 160,
    remain = parseInt(set - tlength);
  if (remain <= 0 && e.which !== 0 && e.charCode !== 0) {
    $('#messageId').val(tval.substring(0, tlength - 1));
    displayErrorMessage(Lang.get('messages.new_change.charchter_160'));
    // $('#validationErrorsBox').html('The message may not be greater than 160 characters.').
    //     show();
  }
});
listenSubmit('#addSMSNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnSMSSave');
  loadingButton.button('loading');
  $('#btnSMSSave').attr('disabled', true);
  if ($('#number').is(':checked')) {
    $('#roleSMSId').remove();
    $('#userSMSId').remove();
  }
  $.ajax({
    url: $('#createSmsUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#AddSMSModal').modal('hide');
        window.livewire.emit('refresh');
        // tbl.ajax.reload();
        // $('#btnSMSSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#btnSMSSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.delete-sms-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#smsUrl').val() + '/' + id, '', $('#smsLang').val());
});
listenHiddenBsModal('#AddSMSModal', function () {
  resetModalForm('#addSMSNewForm', '#validationErrorsBox');
  $('#userSMSId').val('').trigger('change.select2');
  $('#roleSMSId').val('').trigger('change.select2');
  $('#valid-msg').addClass('hide');
  hide();
  $('#btnSMSSave').attr('disabled', false);
});
function hide() {
  $('.myclass').hide();
  $('.smsNumber').attr('value', 0);
  $('.role').show();
  $('.send').show();
}
listen('change', '#roleSMSId', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#getUsersListUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        $('#userSMSId').empty();
        $('#userSMSId').removeAttr('disabled');
        $.each(data.data, function (i, v) {
          $('#userSMSId').append($('<option></option>').attr('value', i).text(v));
        });
      }
    });
  }
  $('#userSMSId').empty();
  $('#userSMSId').prop('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************!*\
  !*** ./resources/assets/js/brands/create-edit.js ***!
  \***************************************************/
document.addEventListener('turbo:load', loadBrandCreateData);
'use strict';
function loadBrandCreateData() {
  listenSubmit('#createBrandForm, #editBrandForm', function () {
    if ($('#error-msg').text() !== '') {
      $('#phoneNumber').focus();
      return false;
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/dashboard/dashboard.js ***!
  \****************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./resources/assets/js/mail/mail.js ***!
  \******************************************/
document.addEventListener('turbo:load', loadMailData);
'use strict';
function loadMailData() {
  $('#emailId').focus();
  listen('change', '#mailAttachmentImage', function () {
    var extension = isValidDocument($(this), '#validationErrorsBox');
    if (!isEmpty(extension) && extension != false) {
      $('#validationErrorsBox').html('').hide();
      displayDocument(this, '#mailPreviewImage', extension);
    }
  });
  window.isValidDocument = function (inputSelector, validationMessageSelector) {
    var ext = $(inputSelector).val().split('.').pop().toLowerCase();
    if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
      $(inputSelector).val('');
      $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
      return false;
    }
    return ext;
  };
  listenClick('.remove-image', function () {
    defaultImagePreview('#mailPreviewImage');
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************************!*\
  !*** ./resources/assets/js/patient_diagnosis_test/create-edit.js ***!
  \*******************************************************************/
document.addEventListener('turbo:load', loadPatientDiagnosisTestData);
function loadPatientDiagnosisTestData() {
  if (!$('#diagnosisTestPatientId').length && !$('#editDiagnosisTestPatientId').length) {
    return;
  }
  $('#diagnosisTestPatientId,#diagnosisTestDoctorId,#diagnosisTestCategoryId').select2();
  $('#editDiagnosisTestPatientId,#editDiagnosisTestDoctorId,#editDiagnosisTestCategoryId').select2();
}
listenClick('#addDiagnosisTestItem,#addEditDiagnosisTestItem', function () {
  var uniqueId = $('.uniqueId').val();
  var data = {
    'uniqueId': uniqueId
  };
  var patientDiagnosisTestHtml = prepareTemplateRender('#patientDiagnosisTestTemplate', data);
  $('.diagnosis-item-container').append(patientDiagnosisTestHtml);
  uniqueId++;
  resetPatientDiagnosisTestIndex();
});
listenClick('.delete-diagnosis', function () {
  $(this).parents('tr').remove();
  resetPatientDiagnosisTestIndex();
});
function resetPatientDiagnosisTestIndex() {
  var index = 1;
  $('.diagnosis-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
}
listenSubmit('.patientDiagnosisTestForm', function (event) {
  event.preventDefault();
  // screenLock();
  var loadingButton = jQuery(this).find('.saveBtn');
  loadingButton.attr('disabled', true);
  // loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.patientDiagnosisTestSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.href = $('.patientDiagnosisTest').val();
      loadingButton.attr('disabled', false);
    },
    error: function error(result) {
      printErrorMessage('#diagnosisTestErrorsBox', result);
      loadingButton.attr('disabled', false);
    }
    // complete: function () {
    //     screenUnLock();
    //     loadingButton.button('reset');
    // },
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************************************!*\
  !*** ./resources/assets/js/patient_diagnosis_test/patient_diagnosis_test.js ***!
  \******************************************************************************/
listenClick('.patient-diagnosys-test-delete-btn', function (event) {
  var patientDiagnosisTestId = $(event.currentTarget).attr('data-id');
  deleteItem($('#patientDiagnosisTestUrl').val() + '/' + patientDiagnosisTestId, '#patientDiagnosisTestTable', $('#patientDiagnosisTestLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************************!*\
  !*** ./resources/assets/js/diagnosis_category/diagnosis_category.js ***!
  \**********************************************************************/


listenSubmit('#addDiagnosisCatForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#diagnosisCatSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#diagnosisCategoryCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_diagnosis_categories_modal').modal('hide');
        // tbl.ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#diagnosisCatErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.diagnosis-category-delete-btn', function (event) {
  var diagnosisCategoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('.diagnosisCategoriesUrl').val() + '/' + diagnosisCategoryId, '#diagnosisCategoryTable', $('#diagnosisCategoryLang').val());
});
listenClick('.diagnosis-category-edit-btn', function (event) {
  var diagnosisCategoryId = $(event.currentTarget).attr('data-id');
  renderDiagnosisCategoryData(diagnosisCategoryId);
});
function renderDiagnosisCategoryData(id) {
  $.ajax({
    url: $('.diagnosisCategoriesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#diagnosisCategoryId').val(result.data.id);
        $('#editDiagnosisCatName').val(result.data.name);
        $('#editDiagnosisCatDescription').val(result.data.description);
        $('#edit_diagnosis_categories_modal').modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editDiagnosisCatForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editDiagnosisCatSave');
  loadingButton.button('loading');
  var id = $('#diagnosisCategoryId').val();
  $.ajax({
    url: $('.diagnosisCategoriesUrl').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_diagnosis_categories_modal').modal('hide');
        // tbl.ajax.reload(null, false);
        if ($('#diagnosisCategoriesShowUrl').length) {
          window.location.href = $('#diagnosisCategoriesShowUrl').val();
        } else {
          livewire.emit('refresh');
        }
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_diagnosis_categories_modal', function () {
  resetModalForm('#addDiagnosisCatForm', '#diagnosisCatErrorsBox');
});
listenHiddenBsModal('#edit_diagnosis_categories_modal', function () {
  resetModalForm('#editDiagnosisCatForm', '#editDiagnosisCatErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************************!*\
  !*** ./resources/assets/js/sidebar_menu_search/sidebar_menu_search.js ***!
  \************************************************************************/


$(document).ready(function () {
  listenKeyup('#menuSearch', function () {
    var value = $(this).val().toLowerCase();
    $('.nav-item').filter(function () {
      $('.no-record').addClass('d-none');
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      checkEmpty();
    });
  });
  function checkEmpty() {
    if ($('.nav-item:visible').last().length == 0) {
      $('.no-record').removeClass('d-none');
    }
  }
  listenClick('.sidebar-aside-toggle', function () {
    if ($(this).hasClass('active') === true) {
      $('.sidebar-search-box').addClass('d-none');
    } else {
      $('.sidebar-search-box').removeClass('d-none');
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/employee/patient_diagnosis_test.js ***!
  \****************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/item_categories/item_categories.js ***!
  \****************************************************************/
listenClick('.editItemCategoryBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var itemCategoryId = $(event.currentTarget).attr('data-id');
  renderItemCategoryData(itemCategoryId);
});
listenClick('.deleteItemCategoryBtn', function (event) {
  var itemCategoryId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexItemCategoriesUrl').val() + '/' + itemCategoryId, '#itemCategoriesTbl', $('#itemCategoryLang').val());
});
function renderItemCategoryData(id) {
  $.ajax({
    url: $('#indexItemCategoriesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var itemCategory = result.data;
        $('#itemCategoryId').val(itemCategory.id);
        $('#editItemCategoryName').val(itemCategory.name);
        $('#edit_item_categories_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#addItemCategoryForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#itemCategorySave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#indexItemCategoryCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_item_categories_modal').modal('hide');
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#itemCatErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editItemCatForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editItemCategorySave');
  loadingButton.button('loading');
  var id = $('#itemCategoryId').val();
  $.ajax({
    url: $('#indexItemCategoriesUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_item_categories_modal').modal('hide');
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_item_categories_modal', function () {
  resetModalForm('#addItemCategoryForm', '#itemCatErrorsBox');
});
listenHiddenBsModal('#edit_item_categories_modal', function () {
  resetModalForm('#editItemCatForm', '#editItemCatErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************!*\
  !*** ./resources/assets/js/items/items.js ***!
  \********************************************/
listenClick('.deleteItemsBtn', function (event) {
  var itemId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexItemUrl').val() + '/' + itemId, '', $('#itemLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************!*\
  !*** ./resources/assets/js/items/create-edit.js ***!
  \**************************************************/
document.addEventListener('turbo:load', loadItemCategory);
function loadItemCategory() {
  if (!$('#itemCategory').length && !$('#editItemCategory').length) {
    return;
  }
  $('#itemCategory').select2({
    width: '100%'
  });
  $('#editItemCategory').select2({
    width: '100%'
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/item_stocks/item_stocks.js ***!
  \********************************************************/
listenClick('.deleteStockBtn', function (event) {
  var itemStockId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexItemStockUrl').val() + '/' + itemStockId, '', $('#itemStockLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/item_stocks/create-edit.js ***!
  \********************************************************/
document.addEventListener('turbo:load', loadItemStocks);
function loadItemStocks() {
  if (!$('#stockItemCategory').length && !$('#editStockItemCategory').length) {
    return;
  }
  $('#stockItemCategory, #editStockItemCategory').select2({
    width: '100%'
  });
  Lang.setLocale(UserCurrentLang);
  $('#stockItems, #editStockItems').select2({
    width: '100%',
    placeholder: Lang.get('messages.new_change.select_item')
  });
  if ($('.isEdit').val()) {
    $('.price-input').trigger('input');
    setTimeout(function () {
      $('#stockItemCategory, #editStockItemCategory').trigger('change');
    }, 300);
  }
}
listenChange('.stockCategory', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('.itemsUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('.stockItems').empty();
          $('.stockItems').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('.stockItems').append($('<option></option>').attr('value', i).text(v));
          });
          if ($('.isEdit').val()) {
            $('.stockItems').val($('#editStockItemId').val()).trigger('change.select2');
            isEdit = false;
          }
        } else $('.stockItems').prop('disabled', true);
      }
    });
  }
  $('.stockItems').empty();
  $('.stockItems').prop('disabled', true);
});
listenChange('.stockAttachment', function () {
  var extension = isValidItemStockDocument($(this));
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '.previewImage', extension);
  }
});
function isValidItemStockDocument(inputSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    UnprocessableInputError('result');
    return false;
  }
  return ext;
}
listenClick('.removeStockImage', function () {
  defaultImagePreview('.previewImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/issued_items/issued_items.js ***!
  \**********************************************************/
listenClick('#issuedItemresetFilter', function () {
  $('#issuedItemHead').val(2).trigger('change');
});
listenClick('.deleteIssuedItemBtn', function (event) {
  var issuedItemId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexIssuedItemUrl').val() + '/' + issuedItemId, '#issuedItemsTable', $('#issuedItemLang').val());
});
listenClick('.changes-status-btn', function (event) {
  var issuedItemId = $(this).data('id');
  var issuedItemStatus = $(this).data('status');
  Lang.setLocale($('.userCurrentLanguage').val());
  if (!issuedItemStatus) {
    swal({
      title: Lang.get('messages.appointment.change_status') + ' ' + '!',
      text: Lang.get('messages.issued_item.are_you_sure_want_to_return_this_item') + ' ' + '?',
      type: 'warning',
      icon: 'warning',
      showCancelButton: true,
      closeOnConfirm: false,
      confirmButtonColor: '#50cd89',
      showLoaderOnConfirm: true,
      buttons: {
        confirm: $('.yesVariable').val(),
        cancel: $('.noVariable').val()
      }
    }).then(function (result) {
      if (result) {
        $.ajax({
          url: $('#indexReturnIssuedItemUrl').val(),
          type: 'get',
          dataType: 'json',
          data: {
            id: issuedItemId
          },
          success: function success(data) {
            swal({
              title: Lang.get('messages.issued_item.item_returned') + ' ' + '!',
              icon: 'success',
              confirmButtonColor: '#50cd89',
              timer: 2000,
              buttons: {
                confirm: $('.okVariable').val()
              }
            });
            livewire.emit('refresh');
          }
        });
      }
    });
  }
});
listenChange('#issuedItemHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  hideDropdownManually($('#issuedItemFilter'), $('#issuedItemFilter'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/issued_items/create.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadIssuedItems);
function loadIssuedItems() {
  Lang.setLocale(UserCurrentLang);
  $('#issueItemCategory, #issueUserType').select2({
    width: '100%'
  });
  $('#issueTo').select2({
    placeholder: Lang.get('messages.message.select_user'),
    width: '100%'
  });
  $('#issueItems').select2({
    placeholder: Lang.get('messages.new_change.select_item'),
    width: '100%'
  });
  var returnDate = $('#issueReturnDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val()
  });
  $('#issueDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val(),
    onChange: function onChange(selectedDates, dateStr, instance) {
      var minDate = moment($('#issueDate').val()).add(1, 'days').format();
      returnDate.set('minDate', minDate);
    }
  });
  $('#issueDate').on('dp.change', function (e) {
    var minDate = moment($('#issueDate').val()).add(1, 'days');
    $('#issueReturnDate').data('DateTimePicker').minDate(minDate);
  });
  setTimeout(function () {
    $('#issueItemCategory, #issueUserType').trigger('change');
  }, 300);
}
listenChange('#issueItemCategory', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#issuedItemsUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#issueItems').empty();
          $('#issueItems').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('#issueItems').append($('<option></option>').attr('value', i).text(v));
          });
          $('#issueItems').trigger('change');
        } else {
          $('#issueItems').prop('disabled', true);
          $('#itemQuantity').prop('disabled', true);
          $('#itemQuantity').val('');
          $('#showAvailableQuantity').text('0');
          $('#itemAvailableQuantity').val(0);
        }
      }
    });
  }
  $('#issueItems').empty();
  // $('#issueItems').append('<option>'+Lang.get('messages.new_theme.select_item')+'</option>')
  $('#issueItems').prop('disabled', true);
});
listenChange('#issueUserType', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#itemIssuedUsersUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#issueTo').empty();
          $('#issueTo').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('#issueTo').append($('<option></option>').attr('value', i).text(v));
          });
        } else $('#issueTo').prop('disabled', true);
      }
    });
  }
  $('#issueTo').empty();
  $('#issueTo').append('<option>' + Lang.get('messages.message.select_user') + '</option>');
  $('#issueTo').prop('disabled', true);
});
listenChange('#issueItems', function () {
  $.ajax({
    url: $('#issuedItemAvailableQtyUrl').val(),
    type: 'get',
    dataType: 'json',
    data: {
      id: $(this).val()
    },
    success: function success(data) {
      $('#itemAvailableQuantity').val(data);
      $('#showAvailableQuantity').text(data);
      $('#itemQuantity').attr('max', data);
      $('#itemQuantity').attr('disabled', false);
    }
  });
});
listenChange('#itemQuantity', function () {
  var availableQuantity = parseInt($('#itemAvailableQuantity').val());
  var quantity = parseInt($(this).val());
  Lang.setLocale($('.userCurrentLanguage').val());
  if (quantity <= availableQuantity) {
    $('#issuedItemSave').prop('disabled', false);
  } else if (quantity === 0) showIssueItemError(Lang.get('messages.issued_item.qty_cannot_be_zero'));else showIssueItemError(Lang.get('messages.issued_item.qty_must_be_less_than_available_qty'));
});
function showIssueItemError(message) {
  toastr.error(message);
  $('#issuedItemSave').prop('disabled', true);
}
listenSubmit('#createIssuedItemForm, #editIssuedItemForm', function () {
  $('#issuedItemSave').attr('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/ipd_patients/ipd_patients.js ***!
  \**********************************************************/
listenChange('#ipd_patients_filter_status', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#ipdResetFilter', function () {
  $('#ipd_patients_filter_status').val('0').trigger('change');
  hideDropdownManually($('#ipdPatientDepartmentFilterBtn'), $('.dropdown-menu'));
});
listen('click', '.deleteIpdDepartmentBtn', function (event) {
  var ipdPatientId = $(event.currentTarget).attr('data-id');
  console.log($('#ipdPatientLang').val());
  deleteItem($('#indexIpdPatientUrl').val() + '/' + ipdPatientId, '', $('#ipdPatientLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/ipd_patients/create.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadIpdPatientCreate);
function loadIpdPatientCreate() {
  if (!$('#ipdAdmissionDate').length && !$('#editIpdAdmissionDate').length) {
    return;
  }
  $('#ipdPatientId, #ipdDoctorId, #ipdBedTypeId,#editIpdPatientId, #editIpdDoctorId, #editIpdBedTypeId').select2({
    width: '100%'
  });
  $('#ipdCaseId, #editIpdCaseId ').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case')
  });
  $('#ipdBedId, #editIpdBedId').select2({
    width: '100%',
    placeholder: Lang.get('messages.bed.choose_bed')
  });
  var admissionFlatPicker = $('#ipdAdmissionDate, #editIpdAdmissionDate').flatpickr({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  if ($('.isEdit').val()) {
    $('.ipdPatientId, .ipdBedTypeId').trigger('change');
    admissionFlatPicker.set('minDate', $('.ipdAdmissionDate').val());
  } else {
    admissionFlatPicker.setDate(new Date());
    admissionFlatPicker.set('minDate', new Date());
  }
}
listenKeyup('.ipdDepartmentFloatNumber', function () {
  if ($(this).val().indexOf('.') != -1) {
    if ($(this).val().split('.')[1].length > 2) {
      if (isNaN(parseFloat(this.value))) return;
      this.value = parseFloat(this.value).toFixed(2);
    }
  }
  return this;
});
listenSubmit('#createIpdPatientForm, #editIpdPatientDepartmentForm', function () {
  $('#ipdSave, #btnIpdPatientEdit').attr('disabled', true);
});
listenChange('.ipdPatientId', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('.patientCasesUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').empty();
          $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').append($('<option></option>').attr('value', i).text(v));
          });
          $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').val($('#editIpdPatientCaseId').val()).trigger('change.select2');
        } else {
          $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').prop('disabled', true);
        }
      }
    });
  }
  $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').empty();
  $('#ipdDepartmentCaseId,#editIpdDepartmentCaseId').prop('disabled', true);
  $('#ipdDepartmentCaseId, #editIpdDepartmentCaseId ').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case')
  });
});
listenChange('.ipdBedTypeId', function () {
  var bedId = null;
  var bedTypeId = null;
  if (typeof $('#editIpdPatientBedId').val() != 'undefined' && typeof $('#editIpdPatientBedTypeId').val() != 'undefined') {
    bedId = $('#editIpdPatientBedId').val();
    bedTypeId = $('#editIpdPatientBedTypeId').val();
  }
  if ($(this).val() !== '') {
    var bedType = $(this).val();
    $.ajax({
      url: $('.patientBedsUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val(),
        isEdit: $('.isEdit').val(),
        bedId: bedId,
        ipdPatientBedTypeId: bedTypeId
      },
      success: function success(data) {
        if (data.data !== null) {
          if (data.data.length !== 0) {
            $('#ipdBedId,#editIpdBedId').empty();
            $('#ipdBedId,#editIpdBedId').removeAttr('disabled');
            $.each(data.data, function (i, v) {
              $('#ipdBedId,#editIpdBedId,#editDischargeIpdBedId').append($('<option></option>').attr('value', i).text(v));
            });
            if (typeof $('#editIpdPatientBedId').val() != 'undefined' && typeof $('#editIpdPatientBedTypeId').val() != 'undefined') {
              if (bedType === $('#editIpdPatientBedTypeId').val()) {
                $('#ipdBedId,#editIpdBedId,#editDischargeIpdBedId').val($('#editIpdPatientBedId').val()).trigger('change.select2');
              }
            }
            $('#ipdBedId,#editIpdBedId').prop('required', true);
          }
        } else {
          $('#ipdBedId,#editIpdBedId').prop('disabled', true);
        }
      }
    });
  }
  $('#ipdBedId,#editIpdBedId').empty();
  $('#ipdBedId,#editIpdBedId').prop('disabled', true);
  $('#ipdBedId, #editIpdBedId,#editDischargeIpdBedId').select2({
    width: '100%',
    placeholder: Lang.get('messages.bed.choose_bed')
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/ipd_diagnosis/ipd_diagnosis.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadIpdDiagnosisData);
function loadIpdDiagnosisData() {
  if (!$('#ipdDiagnosisReportDate').length && !$('#editIpdDiagnosisReportDate').length) {
    return;
  }
  $('#ipdDiagnosisReportDate, #editIpdDiagnosisReportDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    minDate: $('#showIpdPatientCaseDate').val(),
    widgetPositioning: {
      horizontal: 'left',
      vertical: 'bottom'
    },
    locale: $('.userCurrentLanguage').val()
  });
}
listen('click', '.ipdDignosis-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#showIpdDiagnosisUrl').val() + '/' + id, '', $('#ipdDiagnosisLang').val());
});
listenSubmit('#addIpdDiagnosisForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#showIpdDiagnosisCreateUrl').val(),
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  newRecord(data, loadingButton, '#add_ipd_diagnosis_modal');
});
listen('click', '.ipdDignosis-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var ipdDiagnosisId = $(event.currentTarget).attr('data-id');
  renderDataIpdDiagnosis(ipdDiagnosisId);
});
function renderDataIpdDiagnosis(id) {
  $.ajax({
    url: $('#showIpdDiagnosisUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.ipd_diagnosis_document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          $('#editIpdDiagnosisPreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editIpdDiagnosisPreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else {
          if (result.data.ipd_diagnosis_document_url != '') {
            $('#editIpdDiagnosisPreviewImage').css('background-image', 'url("' + result.data.ipd_diagnosis_document_url + '")');
          }
        }
        $('#ipdDiagnosisId').val(result.data.id);
        $('#editIpdDiagnosisReportType').val(result.data.report_type);
        document.querySelector('#editIpdDiagnosisReportDate')._flatpickr.setDate(moment(result.data.report_date).format());
        $('#editIpdDiagnosisDescription').val(result.data.description);
        if (result.data.ipd_diagnosis_document_url != '') {
          $('#editIpdDiagnosisDocumentViewUrl').show();
          $('.btn-view').show();
          $('#editIpdDiagnosisDocumentViewUrl').attr('href', result.data.ipd_diagnosis_document_url);
        } else {
          $('#editIpdDiagnosisDocumentViewUrl').hide();
          $('.btn-view').hide();
        }
        $('#edit_ipd_diagnosis_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editIpdDiagnosisForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editIpdDiagnosisSave');
  loadingButton.button('loading');
  var id = $('#ipdDiagnosisId').val();
  var url = $('#showIpdDiagnosisUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  editRecord(data, loadingButton, '#edit_ipd_diagnosis_modal');
});
listenHiddenBsModal('#add_ipd_diagnosis_modal', function () {
  resetModalForm('#addIpdDiagnosisForm', '#ipdDiagnosisErrorsBox');
  $('#ipdDiagnosisPreviewImage').attr('src', $('#showDefaultDocumentImageUrl').val());
  $('#ipdDiagnosisPreviewImage').css('background-image', 'url("' + $('#showDefaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#edit_ipd_diagnosis_modal', function () {
  resetModalForm('#editIpdDiagnosisForm', '#editIpdDiagnosisErrorsBox');
  $('#editIpdDiagnosisPreviewImage').attr('src', $('#showDefaultDocumentImageUrl').val());
  $('#editIpdDiagnosisPreviewImage').css('background-image', 'url("' + $('#showDefaultDocumentImageUrl').val() + '")');
});
listenChange('#ipdDiagnosisDocumentImage', function () {
  var extension = isValidIpdDiagnosisDocument($(this), '#ipdDiagnosisErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#ipdDiagnosisErrorsBox').html('').hide();
    displayDocument(this, '#ipdDiagnosisPreviewImage', extension);
  }
});
listenChange('#editIpdDiagnosisDocumentImage', function () {
  var extension = isValidIpdDiagnosisDocument($(this), '#editIpdDiagnosisErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editIpdDiagnosisErrorsBox').html('').hide();
    displayDocument(this, '#editIpdDiagnosisPreviewImage', extension);
  }
});
function isValidIpdDiagnosisDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    // $(inputSelector).val('')
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
    // return false
  }
  return ext;
}
listen('click', '.removeIpdDiagnosisImage', function () {
  defaultImagePreview('.previewImage');
});
listen('click', '.removeIpdDiagnosisImageEdit', function () {
  defaultImagePreview('.previewImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************************!*\
  !*** ./resources/assets/js/ipd_consultant_register/ipd_consultant_register.js ***!
  \********************************************************************************/
document.addEventListener('turbo:load', loadIpdConsultantData);
function loadIpdConsultantData() {
  if (!$('#showIpdConsultantRegisterUrl').length) {
    return;
  }
  $('.doctorId').select2({
    width: '100%',
    dropdownParent: $('#addConsultantInstructionModal')
  });
  $('#editConsultantDoctorId').select2({
    width: '100%',
    dropdownParent: $('#editIpdConsultantInstructionModal')
  });
  addDateTimePicker();
}
var removeReadOnlyAttrInDate = function removeReadOnlyAttrInDate(selector) {
  $(selector).attr('readonly', false);
};
removeReadOnlyAttrInDate('.appliedDate');
removeReadOnlyAttrInDate('.instructionDate');
var addDateTimePicker = function addDateTimePicker() {
  $('.appliedDate').flatpickr({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    useCurrent: false,
    sideBySide: true,
    widgetPositioning: {
      horizontal: 'left',
      vertical: 'bottom'
    },
    minDate: $('#showIpdPatientCaseDate').val(),
    locale: $('.userCurrentLanguage').val()
  });
  $('.instructionDate').flatpickr({
    enableTime: false,
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: true,
    widgetPositioning: {
      horizontal: 'left',
      vertical: 'bottom'
    },
    minDate: $('#showIpdPatientCaseDate').val(),
    locale: $('.userCurrentLanguage').val()
  });
};
var dropdownToSelect2 = function dropdownToSelect2(selector) {
  $(selector).select2({
    placeholder: 'Select Doctor',
    width: '100%',
    dropdownParent: $('#addConsultantInstructionModal')
  });
};
listen('click', '#addIpdConsultantItem', function () {
  var uniqueId = $('#showIpdUniqueId').val();
  var data = {
    'doctors': JSON.parse($('#showIpdDoctors').val()),
    'uniqueId': uniqueId
  };
  var ipdConsultantItemHtml = prepareTemplateRender('#ipdConsultantInstructionItemTemplate', data);
  $('.ipd-consultant-item-container').append(ipdConsultantItemHtml);
  dropdownToSelect2('.doctorId');
  addDateTimePicker();
  removeReadOnlyAttrInDate('.appliedDate');
  removeReadOnlyAttrInDate('.instructionDate');
  uniqueId++;
  resetIpdConsultantItemIndex();
});
var resetIpdConsultantItemIndex = function resetIpdConsultantItemIndex() {
  var index = 1;
  var uniqueId = $('#showIpdUniqueId').val();
  $('.ipd-consultant-item-container>tr').each(function () {
    $(this).find('.item-number').text(index);
    index++;
  });
  if (index - 1 == 0) {
    var data = {
      'doctors': JSON.parse($('#showIpdDoctors').val()),
      'uniqueId': uniqueId
    };
    var ipdConsultantItemHtml = prepareTemplateRender('#ipdConsultantInstructionItemTemplate', data);
    $('.ipd-consultant-item-container').append(ipdConsultantItemHtml);
    dropdownToSelect2('.doctorId');
    addDateTimePicker();
    uniqueId++;
  }
};
listen('click', '.deleteIpdConsultantInstruction', function () {
  $(this).parents('tr').remove();
  resetIpdConsultantItemIndex();
});
listen('click', '.delete-consultant-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#showIpdConsultantRegisterUrl').val() + '/' + id, '', $('#ipdConsultantLang').val());
});
listenSubmit('#addIpdConsultantNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnIpdConsultantSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#showIpdConsultantRegisterCreateUrl').val(),
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  newRecord(data, loadingButton, '#addConsultantInstructionModal');
});
listen('click', '.edit-consultant-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var ipdConsultantId = $(event.currentTarget).attr('data-id');
  renderIpdConsultantData(ipdConsultantId);
});
function renderIpdConsultantData(id) {
  $.ajax({
    url: $('#showIpdConsultantRegisterUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#ipdEditConsultantId').val(result.data.id);
        document.querySelector('#editConsultantAppliedDate')._flatpickr.setDate(moment(result.data.applied_date).format());
        $('#editConsultantDoctorId').val(result.data.doctor_id).trigger('change.select2');
        $('#editConsultantDoctorId').select2({
          width: '100%',
          dropdownParent: $('#editIpdConsultantInstructionModal')
        });
        document.querySelector('#editConsultantInstructionDate')._flatpickr.setDate(moment(result.data.instruction_date).format());
        $('#editConsultantInstruction').val(result.data.instruction);
        $('#editIpdConsultantInstructionModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editIpdConsultantNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editConsultantSave');
  loadingButton.button('loading');
  var id = $('#ipdEditConsultantId').val();
  var url = $('#showIpdConsultantRegisterUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  editRecord(data, loadingButton, '#editIpdConsultantInstructionModal');
});
listenHiddenBsModal('#addConsultantInstructionModal', function () {
  resetModalForm('#addIpdConsultantNewForm', '#ipdConsultantErrorsBox');
  $('#ipdConsultantInstructionTbl').find('tr:gt(1)').remove();
  $('.doctorId').val('');
  $('.doctorId').trigger('change');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/ipd_charges/ipd_charges.js ***!
  \********************************************************/
document.addEventListener('turbo:load', loadIpdChargesData);
function loadIpdChargesData() {
  if (!$('#editIpdChargesForm').length && !$('#addIpdChargeNewForm').length) {
    return;
  }
  $('#btnIpdChargeSave,#btnEditCharges').prop('disabled', true);
  $('#ipdChargeDate, #ipdEditChargeDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: true,
    minDate: $('#showIpdPatientCaseDate').val(),
    locale: $('.userCurrentLanguage').val()
  });
  $('#ipdChargeTypeId, #ipdChargeCategoryId, #ipdChargeId').select2({
    dropdownParent: $('#addIpdChargesModal')
  });
  $('#editIpdChargeTypeId, #editIpdChargeCategoryId, #editIpdChargeId').select2({
    dropdownParent: $('#editIpdChargesModal')
  });
}
var editIpdChargeCategoryId = null;
var editIpdChargeId = null;
var editIpdStandardRate = null;
var editAppliedIpdCharge = null;
function renderIpdChargesData(id) {
  $.ajax({
    url: $('#showIpdChargesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        editIpdChargeCategoryId = result.data.charge_category_id;
        editIpdChargeId = result.data.charge_id;
        editIpdStandardRate = result.data.standard_charge;
        editAppliedIpdCharge = result.data.applied_charge;
        $('#ipdChargesId').val(result.data.id);
        document.querySelector('#ipdEditChargeDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editIpdChargeTypeId').val(result.data.charge_type_id).trigger('change', [{
          onceOnEditRender: true
        }]);
        $('.price-input').trigger('input');
        $('#appliedChargeId').text(editAppliedIpdCharge);
        $('#editIpdChargesModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listen('click', '.edit-charges-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var ipdChargesId = $(event.currentTarget).attr('data-id');
  renderIpdChargesData(ipdChargesId);
});
listen('click', '.ipd-charge-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#showIpdChargesUrl').val() + '/' + id, '', $('#ipdChargeLang').val());
});
listenChange('#ipdChargeTypeId, #editIpdChargeTypeId', function (e, onceOnEditRender) {
  var isChargeEdit = $(this).data('is-charge-edit');
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#showIpdChargeCategoryUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      beforeSend: function beforeSend() {
        makeIpdChargesBtnDisabled(isChargeEdit);
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $(!isChargeEdit ? '#ipdChargeCategoryId' : '#editIpdChargeCategoryId').empty();
          $(!isChargeEdit ? '#ipdChargeCategoryId' : '#editIpdChargeCategoryId').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $(!isChargeEdit ? '#ipdChargeCategoryId' : '#editIpdChargeCategoryId').append($('<option></option>').attr('value', i).text(v));
          });
          if (!isChargeEdit) $('#ipdChargeCategoryId').trigger('change');else {
            if (typeof onceOnEditRender == 'undefined') $('#editIpdChargeCategoryId').trigger('change');else {
              $('#editIpdChargeCategoryId').val(editIpdChargeCategoryId).trigger('change', onceOnEditRender);
            }
          }
          $(!isChargeEdit ? '#btnIpdChargeSave' : '#btnEditCharges').prop('disabled', false);
        } else {
          $(!isChargeEdit ? '#ipdChargeCategoryId, #ipdChargeId' : '#editIpdChargeCategoryId, #editIpdChargeId').empty();
          $(!isChargeEdit ? '#ipdStandardCharge, #ipdAppliedCharge' : '#editIpdStandardCharge, #editIpdAppliedCharge').val('');
          $(!isChargeEdit ? '#ipdChargeCategoryId, #ipdChargeId, #btnIpdChargeSave' : '#editIpdChargeCategoryId, #editIpdChargeId, #btnEditCharges').prop('disabled', true);
        }
      }
    });
  }
  $(!isChargeEdit ? '#ipdChargeCategoryId, #ipdChargeId' : '#editIpdChargeCategoryId, #editIpdChargeId').empty();
  $(!isChargeEdit ? '#ipdStandardCharge, #ipdAppliedCharge' : '#editIpdStandardCharge, #editIpdAppliedCharge').val('');
  $(!isChargeEdit ? '#ipdChargeCategoryId, #ipdChargeId' : '#editIpdChargeCategoryId, #editIpdChargeId').prop('disabled', true);
  $('#ipdChargeCategoryId ,#ipdChargeId').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case'),
    dropdownParent: $('#addIpdChargesModal')
  });
  $('#editIpdChargeCategoryId, #editIpdChargeId').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case'),
    dropdownParent: $('#editIpdChargesModal')
  });
});
listenHiddenBsModal('#addIpdChargesModal,#editIpdChargesModal', function () {
  $('#ipdChargeCategoryId ,#ipdChargeId,#editIpdChargeCategoryId, #editIpdChargeId').attr('disabled', true);
});
listenChange('#ipdChargeCategoryId, #editIpdChargeCategoryId', function (e, onceOnEditRender) {
  var isChargeEdit = $(this).data('is-charge-edit');
  if ($(this).val() !== '') {
    $.ajax({
      url: $('#showIpdChargeUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      beforeSend: function beforeSend() {
        makeIpdChargesBtnDisabled(isChargeEdit);
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').empty();
          $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').append($('<option></option>').attr('value', i).text(v));
          });
          if (!isChargeEdit) $('#ipdChargeId').trigger('change');else {
            if (typeof onceOnEditRender == 'undefined') $('#editIpdChargeId').trigger('change');else $('#editIpdChargeId').val(editIpdChargeId).trigger('change', onceOnEditRender);
          }
        } else {
          $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').prop('disabled', true);
        }
      }
    });
  }
  $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').empty();
  $(!isChargeEdit ? '#ipdChargeId' : '#editIpdChargeId').prop('disabled', true);
});
listenChange('#ipdChargeId, #editIpdChargeId', function (e, onceOnEditRender) {
  var isChargeEdit = $(this).data('is-charge-edit');
  $.ajax({
    url: $('#showIpdChargeStandardRateUrl').val(),
    type: 'get',
    dataType: 'json',
    data: {
      id: $(this).val(),
      isEdit: isChargeEdit,
      onceOnEditRender: onceOnEditRender,
      ipdChargeId: $('#ipdChargesId').val()
    },
    beforeSend: function beforeSend() {
      makeIpdChargesBtnDisabled(isChargeEdit);
    },
    success: function success(data) {
      if (!isChargeEdit) {
        $('#ipdStandardCharge, #ipdAppliedCharge').val(data.data);
        $('#btnIpdChargeSave').prop('disabled', false);
      } else {
        if (data.data != null) {
          $('#editIpdStandardCharge').val(data.data.standard_charge);
          $('#editIpdAppliedCharge').val(data.data.applied_charge);
          $('.price-input').trigger('input');
          $('#btnEditCharges').prop('disabled', false);
        }
      }
    }
  });
});
listenSubmit('#addIpdChargeNewForm', function (event) {
  event.preventDefault();
  $('#btnIpdChargeSave').attr('disabled', true);
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#showIpdChargesCreateUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addIpdChargesModal').modal('hide');
        // $(tableName).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
        location.reload();
        $('#btnIpdChargeSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#ipdChargevalidationErrorsBox', result);
      $('#btnIpdChargeSave').attr('disabled', false);
    }
  });
});
listenSubmit('#editIpdChargesForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditCharges');
  loadingButton.button('loading');
  var id = $('#ipdChargesId').val();
  var url = $('#showIpdChargesUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  editRecord(data, loadingButton, '#editIpdChargesModal', '#btnEditCharges');
  location.reload();
});
listenHiddenBsModal('#addIpdChargesModal', function () {
  $('#addIpdChargeNewForm')[0].reset();
  $('#ipdChargeTypeId, #ipdChargeCategoryId, #ipdChargeId, #ipdStandardCharge, #ipdAppliedCharge').val('');
  $('#ipdChargeCategoryId, #ipdChargeId').empty();
  $('#ipdChargeCategoryId').append($('<option>' + Lang.get('messages.pathology_category.select_charge_category') + '</option>'));
  $('#ipdChargeId').append($('<option>' + Lang.get('messages.new_change.select_code') + '</option>'));
  $('#ipdChargeTypeId').trigger('change.select2');
  $('#btnIpdChargeSave').prop('disabled', true);
  $('#ipdChargeDate').flatpickr().clear();
});
listenHiddenBsModal('#editIpdChargesModal', function () {
  $('#btnEditCharges').prop('disabled', true);
});
function makeIpdChargesBtnDisabled(isChargeOnEdit) {
  $(!isChargeOnEdit ? '#btnIpdChargeSave' : '#btnEditCharges').prop('disabled', true);
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/ipd_prescriptions/ipd_prescriptions.js ***!
  \********************************************************************/
document.addEventListener("turbo:load", loadIpdPrescriptionData);
function loadIpdPrescriptionData() {
  if (!$("#editIpdPrescriptionForm").length && !$("#addIpdPrescriptionForm").length) {
    return;
  }
  $(".ipdDoseDuration,.ipdDoseInterval,.ipdMealList").select2({
    width: "100%"
  });
  listen("click", ".deleteIpdPrescriptionBtn", function (event) {
    var id = $(event.currentTarget).attr("data-id");
    deleteItem($("#showIpdPrescriptionUrl").val() + "/" + id, "", $("#ipdPrescriptionLang").val());
  });
  listenClick(".deleteIpdPrescription, .deleteIpdPrescriptionOnEdit", function () {
    $(this).parents("tr").remove();
    resetIpdPrescriptionItemIndex(parseInt($(this).data("edit")));
  });
  listenChange(".ipdCategoryId", function (e, rData) {
    var medicineId = $(document).find("[data-medicine-id='" + $(this).data("id") + "']");
    var uniqueMedicineId = $(this).attr("data-id");
    if ($(this).val() !== "") {
      $.ajax({
        url: $("#showMedicinesListUrl").val(),
        type: "get",
        dataType: "json",
        data: {
          id: $(this).val()
        },
        success: function success(data) {
          if (data.data.length !== 0) {
            medicineId.empty();
            medicineId.removeAttr("disabled");
            medicineId.append($("<option></option>").text(Lang.get("messages.medicine_bills.select_medicine")));
            $.each(data.data, function (i, v) {
              medicineId.append($("<option></option>").attr("value", i).text(v));
            });
            $(".available-qty-div" + uniqueMedicineId).find("small").text("").end().css("margin-top", "0px");
            if ($(".modal").hasClass("show")) {
              medicineSelect2($(".modal.fade.show").attr("id"));
            }
            if (typeof rData != "undefined") {
              medicineId.val(rData.medicineId).trigger("change.select2");
            }
          } else {
            medicineId.append($("<option></option>").text(Lang.get("messages.medicine_bills.select_medicine")));
            $(".available-qty-div" + uniqueMedicineId).find("small").text("").end().css("margin-top", "0px");
          }
        }
      });
    }
    medicineId.empty();
    medicineId.prop("disabled", true);
  });
  listenClick(".editIpdPrescriptionBtn", function (event) {
    if ($(".ajaxCallIsRunning").val()) {
      return;
    }
    ajaxCallInProgress();
    var ipdPrescriptionId = event.currentTarget.dataset.id;
    renderOpdPrescriptionData(ipdPrescriptionId);
  });
  function renderOpdPrescriptionData(id) {
    $.ajax({
      url: $("#showIpdPrescriptionUrl").val() + "/" + id + "/edit",
      type: "GET",
      success: function success(result) {
        if (result.success) {
          var ipdPrescriptionData = result.data.ipdPrescription;
          var ipdPrescriptionItemsData = result.data.ipdPrescriptionItems;
          $("#ipdEditPrescriptionId").val(ipdPrescriptionData.id);
          $("#editHeaderNote").val(ipdPrescriptionData.header_note);
          $("#editFooterNote").val(ipdPrescriptionData.footer_note);
          $.each(ipdPrescriptionItemsData, function (i, v) {
            $("#addPrescriptionItemOnEdit").trigger("click");
            var rowId = $("#showIpdUniqueId").val() - 1;
            var element = $(document).find("[data-avlMedicine-id='" + rowId + "']");
            var availableQuantity = v.medicine.available_quantity;
            var message = Lang.get("messages.issued_item.available_quantity") + ": " + availableQuantity;
            element.text(message).addClass(availableQuantity <= 10 ? "text-danger" : "text-success");
            $(document).find("[data-id='" + rowId + "']").val(v.category_id).trigger("change", [{
              medicineId: v.medicine_id
            }]);
            $(document).find("[data-dose-duration-id='" + rowId + "']").val(v.day).trigger("change", [{
              medicineId: v.medicine_id
            }]);
            $(document).find("[data-dose-interval-id='" + rowId + "']").val(v.dose_interval).trigger("change", [{
              medicineId: v.medicine_id
            }]);
            $(document).find("[data-meal-id='" + rowId + "']").val(v.time).trigger("change", [{
              medicineId: v.medicine_id
            }]);
            $(document).find("[data-dosage-id='" + rowId + "']").val(v.dosage);
            $(document).find("[data-instruction-id='" + rowId + "']").val(v.instruction);
          });
          var index = 1;
          $(".edit-ipd-prescription-item-container>tr").each(function () {
            $(this).find(".prescription-item-number").text(index);
            index++;
          });
          $("#editIpdPrescriptionModal").modal("show");
          ajaxCallCompleted();
        }
      },
      error: function error(result) {
        manageAjaxErrors(result);
      }
    });
  }
  listenSubmit("#editIpdPrescriptionForm", function (event) {
    event.preventDefault();
    if (checkOpdMedicine() !== true) {
      return false;
    }
    var loadingButton = jQuery(this).find("#btnEditIpdPrescriptionSave");
    loadingButton.button("loading");
    var id = $("#ipdEditPrescriptionId").val();
    var url = $("#showIpdPrescriptionUrl").val() + "/" + id;
    var data = {
      formSelector: $(this),
      url: url,
      type: "POST"
      // 'tableSelector': tableName,
    };
    editRecord(data, loadingButton, "#editIpdPrescriptionModal");
  });
  listenClick(".printIpdPrescription", function () {
    var divToPrint = document.getElementById("DivIdToPrint");
    var newWin = window.open("", "Print-Window");
    newWin.document.open();
    newWin.document.write('<html><link href="' + $("#showIpdBootstrapUrl").val() + '" rel="stylesheet" type="text/css"/>' + '<body onload="window.print()">' + divToPrint.innerHTML + "</body></html>");
    newWin.document.close();
    setTimeout(function () {
      newWin.close();
    }, 10);
  });
  listenHiddenBsModal("#addIpdPrescriptionModal", function () {
    $("#avlQtyDiv").find("small").text("").end().css("margin-top", "0px");
    resetModalForm("#addIpdPrescriptionForm", "#validationErrorsBox");
    $("#ipdPrescriptionTbl").find("tr:gt(1)").remove();
    $(".ipdCategoryId").val("");
    $(".ipdCategoryId").trigger("change");
  });
  listenShownBsModal("#addIpdPrescriptionModal", function () {
    medicineSelect2(".medicineId");
    dropdownToSelect2("#ipdPrescriptionItemTemplate");
  });
  listenHiddenBsModal("#editIpdPrescriptionModal", function () {
    $("#avlQtyDiv").find("small").text("").end().css("margin-top", "0px");
    $("#editIpdPrescriptionTbl").find("tr:gt(0)").remove();
    resetModalForm("#editIpdPrescriptionForm", "#editIpdPrescriptionErrorsBox");
  });
  listenClick(".viewIpdPrescription", function (event) {
    var ipdPrescriptionShowId = event.currentTarget.dataset.id;
    $.ajax({
      url: $("#showIpdPrescriptionUrl").val() + "/" + ipdPrescriptionShowId,
      type: "get",
      beforeSend: function beforeSend() {
        screenLock();
      },
      success: function success(result) {
        $("#ipdPrescriptionViewData").html(result);
        $("#showIpdPrescriptionModal").modal("show");
        ajaxCallCompleted();
      },
      complete: function complete() {
        screenUnLock();
      }
    });
  });
}
var dropdownToSelect2 = function dropdownToSelect2(selector) {
  if (selector === "#ipdPrescriptionItemTemplate") {
    $(".ipdCategoryId").select2({
      placeholder: "Select Category",
      width: "100%",
      dropdownParent: $("#addIpdPrescriptionModal")
    });
    $(".ipdDoseDuration,.ipdDoseInterval,.ipdMealList").select2({
      width: "100%"
    });
    $(".medicineId").select2({
      placeholder: "Select Medicine",
      width: "100%",
      dropdownParent: $("#editIpdPrescriptionModal")
    });
  } else {
    $(".ipdCategoryId").select2({
      placeholder: "Select Category",
      width: "100%",
      dropdownParent: $("#editIpdPrescriptionModal")
    });
    $(".ipdDoseDuration,.ipdDoseInterval,.ipdMealList").select2({
      width: "100%"
    });
    $(".medicineId").select2({
      placeholder: "Select Medicine",
      width: "100%",
      dropdownParent: $("#editIpdPrescriptionModal")
    });
  }
};
dropdownToSelect2("#ipdPrescriptionItemTemplate");
var medicineSelect2 = function medicineSelect2(selector) {
  if (selector === "addIpdPrescriptionModal") {
    $(".medicineId").select2({
      placeholder: "Select Category",
      width: "100%",
      dropdownParent: $("#addIpdPrescriptionModal")
    });
  } else {
    $(".medicineId").select2({
      placeholder: "Select Medicine",
      width: "100%",
      dropdownParent: $("#editIpdPrescriptionModal")
    });
  }
};
listenClick("#addPrescriptionItem, #addPrescriptionItemOnEdit", function () {
  var itemSelector = parseInt($(this).data("edit")) ? "#editIpdPrescriptionItemTemplate" : "#ipdPrescriptionItemTemplate";
  var tbodyItemSelector = parseInt($(this).data("edit")) ? ".edit-ipd-prescription-item-container" : ".ipd-prescription-item-container";
  var uniqueId = $("#showIpdUniqueId").val();
  var data = {
    medicineCategories: JSON.parse($("#showMedicineCategories").val()),
    ipdDoseDuration: JSON.parse($(".ipdPrescriptionDurations").val()),
    ipdDoseInterval: JSON.parse($(".ipdPrescriptionIntervals").val()),
    ipdMealList: JSON.parse($(".ipdPrescriptionMealList").val()),
    uniqueId: uniqueId
  };
  var ipdPrescriptionItemHtml = prepareTemplateRender(itemSelector, data);
  $(tbodyItemSelector).append(ipdPrescriptionItemHtml);
  dropdownToSelect2(itemSelector);
  uniqueId++;
  $("#showIpdUniqueId").val(uniqueId);
  resetIpdPrescriptionItemIndex(parseInt($(this).data("edit")));
});
var resetIpdPrescriptionItemIndex = function resetIpdPrescriptionItemIndex(itemMode) {
  var itemSelector = itemMode ? "#editIpdPrescriptionItemTemplate" : "#ipdPrescriptionItemTemplate";
  var tbodyItemSelector = itemMode ? ".edit-ipd-prescription-item-container" : ".ipd-prescription-item-container";
  var itemNo = itemMode ? ".edit-prescription-item-number" : ".prescription-item-number";
  var index = 1;
  $(tbodyItemSelector + ">tr").each(function () {
    $(this).find(itemNo).text(index);
    index++;
  });
  var uniqueId = $("#showIpdUniqueId").val();
  if (index - 1 == 0) {
    var data = {
      medicineCategories: JSON.parse($("#showMedicineCategories").val()),
      ipdDoseDuration: JSON.parse($(".ipdPrescriptionDurations").val()),
      ipdDoseInterval: JSON.parse($(".ipdPrescriptionIntervals").val()),
      ipdMealList: JSON.parse($(".ipdPrescriptionMealList").val()),
      uniqueId: uniqueId
    };
    var ipdPrescriptionItemHtml = prepareTemplateRender(itemSelector, data);
    $(tbodyItemSelector).append(ipdPrescriptionItemHtml);
    dropdownToSelect2(itemSelector);
    uniqueId++;
  }
};
// const resetIpdPrescriptionItemIndex = (itemMode) => {
//     const itemSelector = itemMode
//         ? "#editIpdPrescriptionItemTemplate"
//         : "#ipdPrescriptionItemTemplate";
//     const tbodyItemSelector = itemMode
//         ? ".edit-ipd-prescription-item-container"
//         : ".ipd-prescription-item-container";
//     const itemNo = itemMode
//         ? ".edit-prescription-item-number"
//         : ".prescription-item-number";

//     let index = 1;
//     $(tbodyItemSelector + ">tr").each(function () {
//         $(this).find(itemNo).text(index);
//         index++;
//     });
//     let uniqueId = $("#showIpdUniqueId").val();
//     if (index - 1 == 0) {
//         let data = {
//             medicineCategories: JSON.parse($("#showMedicineCategories").val()),
//             ipdDoseDuration: JSON.parse($(".ipdPrescriptionDurations").val()),
//             ipdDoseInterval: JSON.parse($(".ipdPrescriptionIntervals").val()),
//             ipdMealList: JSON.parse($(".ipdPrescriptionMealList").val()),

//             uniqueId: uniqueId,
//         };
//         let ipdPrescriptionItemHtml = prepareTemplateRender(itemSelector, data);
//         $(tbodyItemSelector).append(ipdPrescriptionItemHtml);
//         dropdownToSelect2(itemSelector);
//         uniqueId++;
//     }
// };

listenSubmit("#addIpdPrescriptionForm", function (event) {
  event.preventDefault();
  if (checkOpdMedicine() !== true) {
    return false;
  }
  var loadingButton = jQuery(this).find("#btnIpdPrescriptionSave");
  loadingButton.button("loading");
  var data = {
    formSelector: $(this),
    url: $("#showIpdPrescriptionCreateUrl").val(),
    type: "POST"
  };
  newRecord(data, loadingButton, "#addIpdPrescriptionModal");
});
function checkOpdMedicine() {
  var result = true;
  $(".medicineId").each(function xyz() {
    if ($(this).val() == "Select Medicine") {
      displayErrorMessage(Lang.get("messages.medicine_bills.medicine_required"));
      result = false;
      return false;
    }
  });
  return result;
}
listenChange(".ipd-prescription-medicine", function () {
  var medicineId = $(this).val();
  var uniqueId = $(this).attr("data-medicine-id");
  if (medicineId == Lang.get("messages.medicine_bills.select_medicine")) {
    $(".available-qty-div" + uniqueId).find("small").text("").end().css("margin-top", "0px");
  }
  $.ajax({
    url: route("get-medicine-quantity", medicineId),
    method: "get",
    cache: false,
    success: function success(result) {
      if (result.data == null) {
        $(".available-qty-div" + uniqueId).find("small").text("").end().css("margin-top", "0px");
        return false;
      }
      if (result.success) {
        if (result.data.available_quantity <= 10) {
          $(".ipd-available-quantity" + uniqueId).text(Lang.get("messages.item.available_quantity") + " : " + result.data.available_quantity).addClass("text-danger").removeClass("text-success");
          $(".available-qty-div" + uniqueId).css({
            "margin-top": "22px"
          });
        } else {
          $(".ipd-available-quantity" + uniqueId).text(Lang.get("messages.item.available_quantity") + " : " + result.data.available_quantity).addClass("text-success").removeClass("text-danger");
          $(".available-qty-div" + uniqueId).css({
            "margin-top": "22px"
          });
        }
      }
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/ipd_timelines/ipd_timelines.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadIpdTimelineData);
function loadIpdTimelineData() {
  if (!$('#editIpdTimelineForm').length && !$('#addIpdTimelineNewForm').length) {
    return;
  }
  getIpdTimelines($('#ipdPatientDepartmentId').val());
  $('#ipdTimelineDate, #editIpdTimelineDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    minDate: $('#showIpdPatientCaseDate').val(),
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#addIpdTimelineNewForm', function (e) {
  e.preventDefault();
  var loadingButton = jQuery(this).find('#btnIpdTimelineSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#showIpdTimelineCreateUrl').val(),
    'type': 'POST',
    'tableSelector': '#tbl'
  };
  newRecord(data, loadingButton, '#addIpdTimelineModal');
  setTimeout(function () {
    getIpdTimelines($('#ipdPatientDepartmentId').val());
  }, 500);
});
listenClick('.edit-timeline-btn', function () {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var ipdTimelineId = $(this).data('timeline-id');
  renderIpdTimelineData(ipdTimelineId);
});
function renderIpdTimelineData(id) {
  $.ajax({
    url: $('#showIpdTimelinesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        if (result.data.ipd_timeline_document_url != '') {
          var ext = result.data.ipd_timeline_document_url.split('.').pop().toLowerCase();
          if (ext == 'pdf') {
            $('#editPreviewIpdTimelineImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
          } else if (ext == 'docx' || ext == 'doc') {
            $('#editPreviewIpdTimelineImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
          } else {
            $('#editPreviewIpdTimelineImage').css('background-image', 'url("' + result.data.ipd_timeline_document_url + '")');
          }
          $('#ipdTimeDocumentUrl').show();
          $('.btn-view').show();
        } else {
          $('#ipdTimeDocumentUrl').hide();
          $('.btn-view').hide();
          $('#editPreviewIpdTimelineImage').css('background-image', 'url("' + $('#showDefaultDocumentImageUrl').val() + '")');
        }
        $('#ipdTimelineId').val(result.data.id);
        $('#editIpdTimelineTitle').val(result.data.title);
        document.querySelector('#editIpdTimelineDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editIpdTimelineDescription').val(result.data.description);
        $('#ipdTimeDocumentUrl').attr('href', result.data.ipd_timeline_document_url);
        result.data.visible_to_person == 1 ? $('#editIpdTimelineVisibleToPerson').prop('checked', true) : $('#editIpdTimelineVisibleToPerson').prop('checked', false);
        $('#editIpdTimelineModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editIpdTimelineForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnIpdTimelineEdit');
  loadingButton.button('loading');
  var id = $('#ipdTimelineId').val();
  var url = $('#showIpdTimelinesUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST',
    'tableSelector': '#tbl'
  };
  editRecord(data, loadingButton, '#editIpdTimelineModal');
  // location.reload()
});
listenClick('.delete-timeline-btn', function () {
  var id = $(this).data('timeline-id');
  swal({
    title: 'Delete !',
    text: Lang.get('messages.common.are_you_sure_want_to_delete_this') + ' ' + Lang.get('messages.lunch_break.ipd_timeline') + ' ?',
    type: 'warning',
    icon: 'warning',
    showCancelButton: true,
    closeOnConfirm: false,
    confirmButtonColor: '#50cd89',
    showLoaderOnConfirm: true,
    buttons: {
      confirm: 'Yes',
      cancel: 'No'
    }
  }).then(function (result) {
    if (result) {
      $.ajax({
        url: $('#showIpdTimelinesUrl').val() + '/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function success(obj) {
          if (obj.success) {
            setTimeout(function () {
              getIpdTimelines($('#ipdPatientDepartmentId').val());
            }, 500);
          }
          swal({
            title: Lang.get('messages.common.deleted') + "!",
            text: Lang.get('messages.lunch_break.ipd_timeline') + ' ' + Lang.get('messages.common.has_been_deleted'),
            icon: 'success',
            confirmButtonColor: '#50cd89',
            timer: 2000
          });
          livewire.emit('refresh');
        }
      });
    }
  });
});
listenHiddenBsModal('#addIpdTimelineModal', function () {
  resetModalForm('#addIpdTimelineNewForm', '#ipdTimelineErrorsBox');
  $('#previewIpdTimelineImage').attr('src', $('#showDefaultDocumentImageUrl').val());
  $('#previewIpdTimelineImage').css('background-image', 'url("' + $('#showDefaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#editIpdTimelineModal', function () {
  resetModalForm('#editIpdTimelineForm', '#editIpdTimelineErrorsBox');
});
listenChange('#ipdTimelineDocumentImage', function () {
  var extension = isValidTimelineIpdDocument($(this), '#ipdTimelineErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#ipdTimelineErrorsBox').html('').hide();
    displayDocument(this, '#previewIpdTimelineImage', extension);
  }
});
listenChange('#editIpdTimelineDocumentImage', function () {
  var extension = isValidTimelineIpdDocument($(this), '#editIpdTimelineErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editIpdTimelineErrorsBox').html('').hide();
    displayDocument(this, '#editPreviewIpdTimelineImage', extension);
  }
});
function isValidTimelineIpdDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    // $(inputSelector).val('')
    $(validationMessageSelector).html('The document must be a file of type: jpeg, jpg, png, pdf, doc, docx.').show();
    // return false
  }
  return ext;
}
function getIpdTimelines(ipdPatientDepartmentId) {
  $.ajax({
    url: $('#showIpdTimelinesUrl').val(),
    type: 'get',
    data: {
      id: ipdPatientDepartmentId
    },
    success: function success(data) {
      $('#ipdTimelines').html(data);
    }
  });
}
listenClick('.removeIpdTimeline', function () {
  defaultImagePreview('#previewIpdTimelineImage');
});
listenClick('.removeIpdTimelineEdit', function () {
  defaultImagePreview('#editPreviewIpdTimelineImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/ipd_payments/ipd_payments.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadIpdPaymentData);
function loadIpdPaymentData() {
  if (!$('#addIpdPaymentNewForm').length && !$('#editIpdPaymentForm').length) {
    return;
  }
  $('#ipdPaymentDate,#editIpdPaymentDate').flatpickr({
    dateFormat: 'Y-m-d',
    enableTime: false,
    minDate: $('#showIpdPatientCaseDate').val(),
    widgetPositioning: {
      horizontal: 'right',
      vertical: 'bottom'
    },
    locale: $('.userCurrentLanguage').val()
  });
  $('#ipdPaymentModeId').select2({
    width: '100%',
    dropdownParent: $('#addIpdPaymentModal')
  });
  $('#editIpdPaymentModeId').select2({
    width: '100%',
    dropdownParent: $('#editIpdPaymentModal')
  });
}
listen('click', '.ipdpayment-delete-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#showIpdPaymentUrl').val() + '/' + id, null, $('#ipdPaymentLang').val());
});
listen('click', '.ipdpayment-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var ipdPaymentId = $(event.currentTarget).attr('data-id');
  renderIpdPaymentData(ipdPaymentId);
});
listenSubmit('#addIpdPaymentNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnIpdPaymentSave');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#showIpdPaymentCreateUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addIpdPaymentModal').modal('hide');
        // $(tableName).DataTable().ajax.reload(null, true);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#ipdPaymentValidationErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
function renderIpdPaymentData(id) {
  $.ajax({
    url: $('#showIpdPaymentUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.ipd_payment_document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          $('#editIpdPaymentPreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editIpdPaymentPreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else {
          if (result.data.ipd_payment_document_url != '') {
            $('#editIpdPaymentPreviewImage').css('background-image', 'url("' + result.data.ipd_payment_document_url + '")');
          }
        }
        $('#ipdPaymentId').val(result.data.id);
        $('#editIpdPaymentAmount').val(result.data.amount);
        document.querySelector('#editIpdPaymentDate')._flatpickr.setDate(moment(result.data.date).format('YYYY-MM-DD h:mm A'));
        $('#editIpdPaymentNote').val(result.data.notes);
        $('#editIpdPaymentModeId').val(result.data.payment_mode).trigger('change.select2');
        $('#editIpdPaymentModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editIpdPaymentForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditIpdPaymentSave');
  loadingButton.button('loading');
  var id = $('#ipdPaymentId').val();
  var url = $('#showIpdPaymentUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST'
    // 'tableSelector': tableName,
  };
  editIpdPaymentRecord(data, loadingButton, '#editIpdPaymentModal');
});
listenHiddenBsModal('#addIpdPaymentModal', function () {
  resetModalForm('#addIpdPaymentNewForm', '#ipdPaymentValidationErrorsBox');
  $('#ipdPaymentPreviewImage').attr('src', $('#showDefaultDocumentImageUrl').val());
  $('#ipdPaymentPreviewImage').css('background-image', 'url("' + $('#showDefaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#editIpdPaymentModal', function () {
  resetModalForm('#editIpdPaymentForm', '#editIpdPaymentValidationErrorsBox');
});
listenChange('#ipdPaymentDocumentImage', function () {
  var extension = isValidIpdPaymentDocument($(this), '#ipdPaymentValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#ipdPaymentValidationErrorsBox').html('').hide();
    displayDocument(this, '#ipdPaymentPreviewImage', extension);
  }
});
listenChange('#editIpdPaymentDocumentImage', function () {
  var extension = isValidIpdPaymentDocument($(this), '#editIpdPaymentValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editIpdPaymentValidationErrorsBox').html('').hide();
    displayDocument(this, '#editIpdPaymentPreviewImage', extension);
  }
});
function isValidIpdPaymentDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
    return false;
  }
  return ext;
}
function deleteItemPaymentAjax(url, tableId, header) {
  var callFunction = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
  $.ajax({
    url: url,
    type: 'DELETE',
    dataType: 'json',
    success: function success(obj) {
      if (obj.success) {
        Livewire.emit('resetPage');
      }
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        confirmButtonColor: '#009ef7',
        text: header + ' ' + Lang.get('messages.common.has_been_deleted'),
        timer: 2000
      });
      if (callFunction) {
        eval(callFunction);
      }
    },
    error: function error(data) {
      Swal.fire({
        title: '',
        text: data.responseJSON.message,
        confirmButtonColor: '#009ef7',
        icon: 'error',
        timer: 5000
      });
    }
  });
}
window.editIpdPaymentRecord = function (data, loadingButton) {
  var modalSelector = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '#EditModal';
  var formData = data.formSelector === '' ? data.formData : new FormData($(data.formSelector)[0]);
  $.ajax({
    url: data.url,
    type: data.type,
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $(modalSelector).modal('hide');
        // $(tableName).DataTable().ajax.reload(null, true);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
};
listen('click', '#ipdPaymentDocumentImage', function () {
  defaultImagePreview('#ipdPaymentPreviewImage');
});
listen('click', '.removeIpdPaymentImageEdit', function () {
  defaultImagePreview('#editIpdPaymentPreviewImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_patients.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_diagnosis.js ***!
  \****************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_consultant_register.js ***!
  \**************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_charges.js ***!
  \**************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_prescriptions.js ***!
  \********************************************************************/
listenClick('.viewIpdPrescription', function () {
  $.ajax({
    url: $('#showIpdPrescriptionUrl').val() + '/' + $(this).data('id'),
    type: 'get',
    success: function success(result) {
      $('#ipdPrescriptionViewData').html(result);
      $('#showIpdPrescriptionModal').modal('show');
      ajaxCallCompleted();
    }
  });
});
listenClick('.printIpdPrescription', function () {
  var divToPrint = document.getElementById('DivIdToPrint');
  var newWin = window.open('', 'Print-Window');
  newWin.document.open();
  newWin.document.write('<html><link href="' + $('#showListBootstrapUrl').val() + '" rel="stylesheet" type="text/css"/>' + '<body onload="window.print()">' + divToPrint.innerHTML + '</body></html>');
  newWin.document.close();
  setTimeout(function () {
    newWin.close();
  }, 10);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_timelines.js ***!
  \****************************************************************/
document.addEventListener('turbo:load', loadIpdTimelineData);
function loadIpdTimelineData() {
  if (!$('#showListIpdPatientDepartmentId').length) {
    return;
  }
  getPatientListIpdTimelines($('#showListIpdPatientDepartmentId').val());
}
function getPatientListIpdTimelines(ipdPatientDepartmentId) {
  $.ajax({
    url: $('#showListIpdTimelinesUrl').val(),
    type: 'get',
    data: {
      id: ipdPatientDepartmentId
    },
    success: function success(data) {
      $('#ipdTimelines').html(data);
    }
  });
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_payments.js ***!
  \***************************************************************/
document.addEventListener('turbo:load', loadIpdPaymentsData);
function loadIpdPaymentsData() {
  if ($('#showListIpdTimelinesUrl').length) {
    var patientOptions = {
      'key': $('.patientRazorpayDataKey').val(),
      'amount': 0,
      //  100 refers to 1
      'currency': 'INR',
      'name': $('.patientRazorpayDataName').val(),
      'order_id': '',
      'description': '',
      'image': $('.patientRazorpayDataImage').val(),
      // logo here
      'callback_url': $('.patientRazorpayDataCallBackURL').val(),
      'prefill': {
        'email': '',
        // recipient email here
        'name': '',
        // recipient name here
        'contact': '' // recipient phone here
      },
      'readonly': {
        'name': 'true',
        'email': 'true',
        'contact': 'true'
      },
      'modal': {
        'ondismiss': function ondismiss() {
          displayErrorMessage(Lang.get('messages.flash.your_payment_failed'));
        }
      }
    };
    listenClick('#ipdPaymentRazorpayBtn', function () {
      $.ajax({
        type: 'GET',
        url: route('patient.razorpay.init'),
        data: {
          'amount': parseInt($('#billAmout').val()),
          'ipdNumber': $('#ipdNumber').val()
        },
        success: function success(result) {
          if (result.url) {
            window.location.href = result.url;
          }
          if (result.success) {
            var _result$data = result.data,
              id = _result$data.id,
              currency = _result$data.currency,
              amount = _result$data.amount,
              name = _result$data.name,
              email = _result$data.email,
              contact = _result$data.contact;
            patientOptions.currency = currency;
            patientOptions.amount = amount;
            patientOptions.order_id = id;
            patientOptions.prefill.name = name;
            patientOptions.prefill.email = email;
            patientOptions.prefill.contact = contact;
            var patientRazorPay = new Razorpay(patientOptions);
            patientRazorPay.open();
            patientRazorPay.on('payment.failed', storePatientFailedPayment);
          }
        },
        error: function error(result) {
          displayErrorMessage(result.responseJSON.message);
        },
        complete: function complete() {}
      });
    });
  }
}
listenClick('#ipdPaymentPaypalBtn', function () {
  $.ajax({
    type: 'GET',
    url: route('patient.paypal.init'),
    data: {
      'amount': parseInt($('#billAmout').val()),
      'ipdNumber': $('#ipdNumber').val()
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});
function storePatientFailedPayment(response) {
  $.ajax({
    type: 'POST',
    url: $('.patientRazorpayPaymentFailed').val(),
    data: {
      data: response
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
listenClick('#ipdPaymentPaytmBtn', function () {
  window.location.replace(route('patient.paytm.init', {
    'amount': parseInt($('#billAmout').val()),
    'ipdNumber': $('#ipdNumber').val()
  }));
});
listenClick('#ipdPaymentPayStackBtn', function () {
  window.location.replace(route('patient.paystack.init', {
    'amount': parseInt($('#billAmout').val()),
    'ipdNumber': $('#ipdNumber').val()
  }));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/ipd_bills/ipd_bills.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadIpdBills);
function loadIpdBills() {
  if (!$('#ipdBillForm').length) {
    return false;
  }
  var totalCharges = 0;
  var totalPayments = 0;
  var grossTotal = 0;
  var discountPercent = 0;
  var taxPercentage = 0;
  var otherCharges = 0;
  var netPayabelAmount = 0;
  var totalDiscount = 0;
  var totalTax = 0;
  var bedCharge = 0;
  if ($('#showIpdBillStatus').val() == 1) {
    $(' #discountPercent, #taxPercentage,#otherCharges ').prop('disabled', true);
  }
  calculateIpdBill();
  // if (grossTotal < 0) {
  //     $('#grossTotal').text(0)
  //     $(' #discountPercent, #taxPercentage,#otherCharges ').
  //         prop('disabled', true)
  // }
}
listenKeyup('#discountPercent, #taxPercentage, #otherCharges', function () {
  if (this.id == 'discountPercent' || this.id == 'taxPercentage') {
    if (parseInt(removeCommas($(this).val())) > 100) {
      $(this).val(100);
    }
  }
  calculateIpdBill();
});
listenSubmit('#ipdBillForm', function (e) {
  e.preventDefault();
  $(' #discountPercent, #taxPercentage,#otherCharges').prop('disabled', false);
  screenLock();
  $('#saveIpdBillbtn').attr('disabled', true);
  var loadingButton = jQuery(this).find('#saveIpdBillbtn');
  loadingButton.button('loading');
  calculateIpdBill();
  var formData = new FormData($(this)[0]);
  formData.append('total_charges', totalCharges);
  formData.append('total_payments', totalPayments);
  formData.append('bed_charge', bedCharge);
  formData.append('gross_total', grossTotal);
  formData.append('net_payable_amount', finalNetPayabelAmount);
  $.ajax({
    url: $('#showIpdBillSaveUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.location.reload();
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#saveIpdBillbtn').attr('disabled', false);
    },
    complete: function complete() {
      screenUnLock();
      loadingButton.button('reset');
    }
  });
});
function removeCurrencySymbol(amount) {
  var result = amount.replace(/\D/g, '');
  return parseInt(result);
}
function calculateIpdBill() {
  var currentCurrency = $(".currentCurrency").val();

  // totalCharges = removeCurrencySymbol($('#totalCharges').text().replace(/\.00/,''))
  // totalPayments = removeCurrencySymbol($('#totalPayments').text().replace(/\.00/,''))
  // grossTotal = removeCurrencySymbol($('#grossTotal').text().replace(/\.00/,''))
  // bedCharge = removeCurrencySymbol($('#bedCharge').text().replace(/\.00/,''))

  totalCharges = $('#totalCharges').data('amount');
  totalPayments = $('#totalPayments').data('amount');
  grossTotal = $('#grossTotal').data('amount');
  bedCharge = $('#bedCharge').data('amount');

  // discountPercent = removeCurrencySymbol($('#discountPercent').val().replace(/\.00/,''))
  // taxPercentage = removeCurrencySymbol($('#taxPercentage').val().replace(/\.00/,''))
  // otherCharges = removeCurrencySymbol($('#otherCharges').val().replace(/\.00/,''))

  discountPercent = removeCurrencySymbol($('#discountPercent').val());
  taxPercentage = removeCurrencySymbol($('#taxPercentage').val());
  otherCharges = removeCurrencySymbol($('#otherCharges').val());
  discountPercent = isNaN(discountPercent) ? 0 : discountPercent;
  taxPercentage = isNaN(taxPercentage) ? 0 : taxPercentage;
  otherCharges = isNaN(otherCharges) ? 0 : otherCharges;

  //calculate
  var total = totalCharges - (totalPayments - otherCharges);
  totalDiscount = percentage(discountPercent, totalCharges + bedCharge);
  totalTax = percentage(taxPercentage, totalCharges + bedCharge);
  netPayabelAmount = isNaN(totalCharges + otherCharges + totalTax - (totalPayments + totalDiscount)) ? 0 : totalCharges + otherCharges + totalTax - (totalPayments + totalDiscount);
  finalNetPayabelAmount = netPayabelAmount + bedCharge;
  if (finalNetPayabelAmount > 0) $('#billStatus').html('Unpaid');else {
    finalNetPayabelAmount = 0;
    $('#billStatus').html('Paid');
  }
  $('#netPayabelAmount').text(currentCurrency + addCommas(Math.round(finalNetPayabelAmount).toFixed(2)));
}
function percentage(percent, total) {
  return percent / 100 * total;
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/opd_patients/opd_patients.js ***!
  \**********************************************************/
listen('click', '.deleteOpdPatientBtn', function (event) {
  var opdPatientsId = $('.deleteOpdPatientBtn').attr('data-id');
  deleteItem($('#indexOpdPatientUrl').val() + '/' + opdPatientsId, null, $('#opdPatientLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/opd_patients/create.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadOpdPatientData);
function loadOpdPatientData() {
  if (!$('#createOpdPatientForm').length && !$('#editOpdPatientDepartmentForm').length) {
    return;
  }
  $('#opdPatientId, #opdDoctorId,#opdPaymentMode,#editOpdPatientId, #editOpdDoctorId,#editOpdPaymentMode').select2({
    width: '100%'
  });
  $('#opdCaseId ,#editOpdCaseId').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case')
  });
  var appointmentDateFlatPicker = $("#opdAppointmentDate,#editOpdAppointmentDate ").flatpickr({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  if ($('.lastVisit').val()) {
    $('#opdPatientId,#editOpdPatientId').val($('.lastVisit').val()).trigger('change');
    $('#opdPatientId,#editOpdPatientId').attr('disabled', true);
  }
  if ($('.isEdit').val()) {
    $('#opdPatientId,#editOpdPatientId').attr('disabled', true);
    $('#opdPatientId,#editOpdPatientId').trigger('change');
    appointmentDateFlatPicker.set('minDate', $('#opdAppointmentDate,#editOpdAppointmentDate').val());
  } else {
    appointmentDateFlatPicker.setDate(new Date());
    appointmentDateFlatPicker.set('minDate', new Date());
  }
}
listenSubmit('#createOpdPatientForm, #editOpdPatientDepartmentForm', function () {
  $('#opdPatientId,#editOpdPatientId').attr('disabled', false);
  $('#btnOpdSave,#btnEditOpdSave').attr('disabled', true);
});
listenChange('#opdPatientId,#editOpdPatientId', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('.opdPatientCasesUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#opdCaseId,#editOpdCaseId').empty();
          $('#opdCaseId,#editOpdCaseId').removeAttr('disabled');
          $.each(data.data, function (i, v) {
            if ($('.patientCaseId').val() == v) {
              $('#editOpdCaseId').append($('<option></option>').attr('value', i).attr('selected', true).text(v));
            } else {
              $('#opdCaseId,#editOpdCaseId').append($('<option></option>').attr('value', i).text(v));
            }
          });
        } else {
          $('#opdCaseId,#editOpdCaseId').prop('disabled', true);
        }
      }
    });
  }
  $('#opdCaseId,#editOpdCaseId').empty();
  $('#opdCaseId,#editOpdCaseId').prop('disabled', true);
  $('#opdCaseId ,#editOpdCaseId').select2({
    width: '100%',
    placeholder: Lang.get('messages.ipd_patient.choose_case')
  });
});
listenChange('#opdDoctorId,#editOpdDoctorId', function () {
  if ($(this).val() !== '') {
    $.ajax({
      url: $('.doctorOpdChargeUrl').val(),
      type: 'get',
      dataType: 'json',
      data: {
        id: $(this).val()
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $('#opdStandardCharge,#editOpdStandardCharge').val(data.data[0].standard_charge);
        } else {
          $('#opdStandardCharge,#editOpdStandardCharge').val(0);
        }
      }
    });
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/opd_patients/visits.js ***!
  \****************************************************/
listen('click', '.delete-visit-btn', function (event) {
  var opdPatientId = $(event.currentTarget).attr('data-id');
  deleteItem($('#showOpdPatientUrl').val() + '/' + opdPatientId, '', $('#opdPatientVisitLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************************!*\
  !*** ./resources/assets/js/ipd_patients_list/ipd_stripe_payment.js ***!
  \*********************************************************************/
document.addEventListener('turbo:load', loadIpdStrikePaymentData);
function loadIpdStrikePaymentData() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  listenClick('#ipdPaymentStripeBtn', function () {
    var _this = this;
    var payloadData = {
      amount: parseInt($('#billAmout').val()),
      ipdNumber: $('#ipdNumber').val()
    };
    var stripeKey = $('#stripeConfigKey').val();
    var stripe = Stripe(stripeKey);

    // console.log(payloadData);
    // return false;
    $(this).html('<div class="spinner-border spinner-border-sm " role="status">\n' + '                                            <span class="sr-only">Loading...</span>\n' + '                                        </div>').addClass('disabled');
    $.post($('#showListIpdStripePaymentUrl').val(), payloadData).done(function (result) {
      var sessionId = result.data.sessionId;
      stripe.redirectToCheckout({
        sessionId: sessionId
      }).then(function (result) {
        $(this).html('Make Payment').removeClass('disabled');
        manageAjaxErrors(result);
      });
    })["catch"](function (error) {
      $(_this).html('Make Payment').removeClass('disabled');
      manageAjaxErrors(error);
    });
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/opd_diagnosis/opd_diagnosis.js ***!
  \************************************************************/
// import moment from 'moment'

document.addEventListener('turbo:load', loadOpdDiagnosisData);
function loadOpdDiagnosisData() {
  if (!$('#opdDiagnosisReportDate').length && !$('#editOpdDiagnosisReportDate').length) {
    return;
  }
  $('#opdDiagnosisReportDate, #editOpdDiagnosisReportDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    useCurrent: true,
    sideBySide: true,
    minDate: moment($('#showOpdAppointmentDate').val()).format('YYYY-MM-DD'),
    widgetPositioning: {
      horizontal: 'left',
      vertical: 'bottom'
    },
    locale: $('.userCurrentLanguage').val()
  });
}
listenClick('.deleteOpdDiagnosisBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('#showOpdDiagnosisUrl').val() + '/' + id, null, $('#opdDiagnosisLang').val());
});
listenSubmit('#addOpdDiagnosisForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnOpdDiagnosisSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#showOpdDiagnosisCreateUrl').val(),
    'type': 'POST',
    'tableSelector': null
  };
  newRecord(data, loadingButton, '#add_opd_diagnoses_modal');
});
listenClick('.editOpdDiagnosisBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var opdDiagnosisId = $(event.currentTarget).attr('data-id');
  renderOpdDiagnosisData(opdDiagnosisId);
});
window.renderOpdDiagnosisData = function (id) {
  $.ajax({
    url: $('#showOpdDiagnosisUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.opd_diagnosis_document_url.split('.').pop().toLowerCase();
        if (ext == 'pdf') {
          $('#editOpdDiagnosisPreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
        } else if (ext == 'docx' || ext == 'doc') {
          $('#editOpdDiagnosisPreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
        } else {
          if (result.data.opd_diagnosis_document_url != '') {
            $('#editOpdDiagnosisPreviewImage').css('background-image', 'url("' + result.data.opd_diagnosis_document_url + '")');
          }
        }
        $('#opdDiagnosisId').val(result.data.id);
        $('#editOpdDiagnosisReportType').val(result.data.report_type);
        document.querySelector('#editOpdDiagnosisReportDate')._flatpickr.setDate(moment(result.data.report_date).format());
        $('#editOpdDiagnosisDescription').val(result.data.description);
        if (result.data.opd_diagnosis_document_url != '') {
          $('#opdDiagnosisDocumentUrl').show();
          $('.btn-view').show();
          $('#opdDiagnosisDocumentUrl').attr('href', result.data.opd_diagnosis_document_url);
        } else {
          $('#opdDiagnosisDocumentUrl').hide();
          $('.btn-view').hide();
        }
        $('#edit_opd_diagnoses_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editOpdDiagnosisForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditOpdDiagnosisSave');
  loadingButton.button('loading');
  var id = $('#opdDiagnosisId').val();
  var url = $('#showOpdDiagnosisUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST',
    'tableSelector': null
  };
  editRecord(data, loadingButton, '#edit_opd_diagnoses_modal');
});
listenHiddenBsModal('#add_opd_diagnoses_modal', function () {
  resetModalForm('#addOpdDiagnosisForm', '#opdDiagnosisErrorsBox');
  $('#opdDiagnosisPreviewImage').attr('src', $('#showOpdDefaultDocumentImageUrl').val());
  $('#opdDiagnosisPreviewImage').css('background-image', 'url("' + $('#showOpdDefaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#edit_opd_diagnoses_modal', function () {
  resetModalForm('#editOpdDiagnosisForm', '#editOpdDiagnosisErrorsBox');
  $('#editOpdDiagnosisPreviewImage').attr('src', $('#showOpdDefaultDocumentImageUrl').val());
  $('#editOpdDiagnosisPreviewImage').css('background-image', 'url("' + $('#showOpdDefaultDocumentImageUrl').val() + '")');
});
listenChange('#opdDiagnosisDocumentImage', function () {
  var extension = isValidDocumentOpdDiagnosis($(this), '#opdDiagnosisErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#opdDiagnosisErrorsBox').html('').hide();
    displayDocument(this, '#opdDiagnosisPreviewImage', extension);
  }
});
listenChange('#editOpdDiagnosisDocumentImage', function () {
  var extension = isValidDocumentOpdDiagnosis($(this), '#editOpdDiagnosisErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editOpdDiagnosisErrorsBox').html('').hide();
    displayDocument(this, '#editOpdDiagnosisPreviewImage', extension);
  }
});
window.isValidDocumentOpdDiagnosis = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    // $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
    // return false;
  }
  return ext;
};
listenClick('.removeOpdDiagnosisImage', function () {
  defaultImagePreview('#opdDiagnosisPreviewImage');
});
listenClick('.removeOpdDiagnosisImageEdit', function () {
  defaultImagePreview('#editOpdDiagnosisPreviewImage');
});
listen('change', '.report-generate', function (event) {
  var diagnosisId = $(this).attr('data-id');
  updateDiagnosisReportStatus(diagnosisId);
});
window.updateDiagnosisReportStatus = function (id) {
  $.ajax({
    url: route('patient.diagnosis.report.status', id),
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/opd_timelines/opd_timelines.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadOpdTimelineData);
function loadOpdTimelineData() {
  if (!$('#opdTimelineDate').length && !$('#editOpdTimelineDate').length) {
    return;
  }
  getOpdTimelines($('#opdPatientDepartmentId').val());
  $('#opdTimelineDate, #editOPdTimelineDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    minDate: moment($('#showOpdAppointmentDate').val()).format('YYYY-MM-DD'),
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#addOpdTimelineNewForm', function (e) {
  e.preventDefault();
  var loadingButton = jQuery(this).find('#btnOpdTimelineSave');
  loadingButton.button('loading');
  var data = {
    'formSelector': $(this),
    'url': $('#showOpdTimelineCreateUrl').val(),
    'type': 'POST',
    'tableSelector': '#tbl'
  };
  newRecord(data, loadingButton, '#addOpdTimelineModal');
  setTimeout(function () {
    getOpdTimelines($('#opdPatientDepartmentId').val());
  }, 500);
});
listenClick('.edit-OpdTimeline-btn', function () {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var opdTimelineId = $(this).data('timeline-id');
  renderOpdTimelineData(opdTimelineId);
});
window.renderOpdTimelineData = function (id) {
  $.ajax({
    url: $('#showOpdTimelinesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        if (result.data.opd_timeline_document_url != '') {
          var ext = result.data.opd_timeline_document_url.split('.').pop().toLowerCase();
          if (ext == 'pdf') {
            $('#editOpdPreviewTimelineImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
          } else if (ext == 'docx' || ext == 'doc') {
            $('#editOpdPreviewTimelineImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
          } else {
            $('#editOpdPreviewTimelineImage').css('background-image', 'url("' + result.data.opd_timeline_document_url + '")');
          }
          $('#editOpdTimeDocumentUrl').show();
          $('.btn-view').show();
        } else {
          $('#editOpdTimeDocumentUrl').hide();
          $('.btn-view').hide();
          $('#editOpdPreviewTimelineImage').css('background-image', 'url("' + $('#showOpdDefaultDocumentImageUrl').val() + '")');
        }
        $('#opdTimelineId').val(result.data.id);
        $('#editOPdTimelineTitle').val(result.data.title);
        document.querySelector('#editOPdTimelineDate')._flatpickr.setDate(moment(result.data.date).format());
        $('#editOpdTimelineDescription').val(result.data.description);
        $('#editOpdTimeDocumentUrl').attr('href', result.data.opd_timeline_document_url);
        result.data.visible_to_person == 1 ? $('#editOpdTimelineVisibleToPerson').prop('checked', true) : $('#editOpdTimelineVisibleToPerson').prop('checked', false);
        $('#editOpdTimelineModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editOpdTimelineForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnOpdTimelineEdit');
  loadingButton.button('loading');
  var id = $('#opdTimelineId').val();
  var url = $('#showOpdTimelinesUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'POST',
    'tableSelector': '#tbl'
  };
  editRecord(data, loadingButton, '#editOpdTimelineModal');
  setTimeout(function () {
    getOpdTimelines($('#opdPatientDepartmentId').val());
    // location.reload();
  }, 500);
});
listenClick('.delete-OpdTimeline-btn', function () {
  var id = $(this).data('timeline-id');
  swal({
    title: $('.deleteVariable').val() + '!',
    text: $('.confirmVariable').val() + $('#opdTimelineLang').val() + '?',
    type: 'warning',
    icon: 'warning',
    showCancelButton: true,
    closeOnConfirm: false,
    confirmButtonColor: '#50cd89',
    showLoaderOnConfirm: true,
    buttons: {
      confirm: $('#opdTimelineLangYes').val(),
      cancel: $('#opdTimelineLangNo').val()
    }
  }).then(function (result) {
    if (result) {
      $.ajax({
        url: $('#showOpdTimelinesUrl').val() + '/' + id,
        type: 'DELETE',
        dataType: 'json',
        success: function success(obj) {
          if (obj.success) {
            setTimeout(function () {
              getOpdTimelines($('#opdPatientDepartmentId').val());
            }, 500);
          }
          swal({
            title: $('.deletedVariable').val(),
            text: $('#opdTimelineLang').val() + $('.hasBeenDeletedVariable').val(),
            icon: 'success',
            confirmButtonColor: '#50cd89',
            timer: 2000,
            buttons: {
              confirm: $('.okVariable').val()
            }
          });
          livewire.emit('refresh');
        }
      });
    }
  });
});
listenHiddenBsModal('#addOpdTimelineModal', function () {
  resetModalForm('#addOpdTimelineNewForm', '#timeLinevalidationErrorsBox');
  $('#previewTimelineImage').attr('src', $('.defaultDocumentImageUrl').val());
  $('#previewTimelineImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#editOpdTimelineModal', function () {
  resetModalForm('#editOpdTimelineForm', '#editTimelineValidationErrorsBox');
});
listenChange('#opdTimelineDocumentImage', function () {
  var extension = isValidOpdTimelineDocument($(this), '#timeLinevalidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#timeLinevalidationErrorsBox').html('').hide();
    displayDocument(this, '#opdPreviewTimelineImage', extension);
  }
});
listenChange('#editOpdTimelineDocumentImage', function () {
  var extension = isValidOpdTimelineDocument($(this), '#editTimelineValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editTimelineValidationErrorsBox').html('').hide();
    displayDocument(this, '#editOpdPreviewTimelineImage', extension);
  }
});
window.isValidOpdTimelineDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    // $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).show();
    // return false;
  }
  return ext;
};
function getOpdTimelines(opdPatientDepartmentId) {
  $.ajax({
    url: $('#showOpdTimelinesUrl').val(),
    type: 'get',
    data: {
      id: opdPatientDepartmentId
    },
    success: function success(data) {
      $('#opdTimelines').html(data);
    }
  });
}
listenClick('.removeOpdTimelineImage', function () {
  defaultImagePreview('#opdPreviewTimelineImage');
});
listenClick('.removeOpdTimelineImageEdit', function () {
  defaultImagePreview('#editOpdPreviewTimelineImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/opd_patients_list/opd_patients.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./resources/assets/js/opd_patients_list/visits.js ***!
  \*********************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/opd_patients_list/opd_diagnosis.js ***!
  \****************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/opd_patients_list/opd_timelines.js ***!
  \****************************************************************/
document.addEventListener('turbo:load', loadPatientOpdTimelineData);
function loadPatientOpdTimelineData() {
  if (!$('#showOpdListPatientDepartmentId').length) {
    return;
  }
  getOpdTimelines($('#showOpdListPatientDepartmentId').val());
}
function getOpdTimelines(opdPatientDepartmentId) {
  $.ajax({
    url: $('#showOpdListTimelinesUrl').val(),
    type: 'get',
    data: {
      id: opdPatientDepartmentId
    },
    success: function success(data) {
      $('#opdTimelines').html(data);
    }
  });
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/opd_tab_active/opd_tab_active.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadOpdTabActiveData);
function loadOpdTabActiveData() {
  if (!$('#OPDtab').length) {
    return;
  }
  // on load of the page: switch to the currently selected tab
  var hash = window.location.hash;
  $('#OPDtab a[href="' + hash + '"]').tab('show');
}
listenClick('#OPDtab a', function (e) {
  e.preventDefault();
  $(this).tab('show');
});
// store the currently selected tab in the hash value
$('ul.nav-tabs > li > a').on('shown.bs.tab', function (e) {
  var id = $(e.target).attr('href').substr(1);
  window.location.hash = id;
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!***************************************************!*\
  !*** ./resources/assets/js/call_logs/call_log.js ***!
  \***************************************************/


// $('#callType').select2();
listenClick('#callLogResetFilter', function () {
  $('#callType').val(0).trigger('change');
  hideDropdownManually($('#callTypeFilterBtn'), $('.dropdown-menu'));
});
listenClick('.call-log-delete-btn', function (event) {
  var callLogId = $(event.currentTarget).attr('data-id');
  deleteItem($('.callLogUrl').val() + '/' + callLogId, '#callLogTbl', $('#callLogLang').val());
});
listenChange('#callType', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************!*\
  !*** ./resources/assets/js/call_logs/create-edit.js ***!
  \******************************************************/
document.addEventListener('turbo:load', loadCallLogsCreateEdit);
function loadCallLogsCreateEdit() {
  if ($('#createCallLogForm').length || $('#editCallLogForm').length) {
    var callLogFollowUpDate = undefined;
    if ($('editCallLogId').length) {
      $('#callLogDate').flatpickr({
        format: 'YYYY-MM-DD',
        useCurrent: true,
        sideBySide: true,
        minDate: moment(new Date()).format('YYYY-MM-DD'),
        locale: $('.userCurrentLanguage').val(),
        onChange: function onChange(selectedDates, dateStr, instance) {
          var callLogMinDate = moment($('#callLogDate').val()).format();
          if (typeof followUpDate != 'undefined') {
            followUpDate.set('minDate', callLogMinDate);
          }
        }
      });
    } else {
      $('#callLogDate').flatpickr({
        format: 'YYYY-MM-DD',
        useCurrent: true,
        sideBySide: true,
        minDate: moment(new Date()).format('YYYY-MM-DD'),
        locale: $('.userCurrentLanguage').val(),
        onChange: function onChange(selectedDates, dateStr, instance) {
          var callLogMinDate = moment($('#callLogDate').val()).format();
          if (typeof callLogFollowUpDate != 'undefined') {
            callLogFollowUpDate.set('minDate', callLogMinDate);
          }
        }
      });
    }
    callLogFollowUpDate = $('#callLogFollowUpDate').flatpickr({
      format: 'YYYY-MM-DD',
      useCurrent: true,
      sideBySide: true,
      locale: $('.userCurrentLanguage').val()
    });
    var callLogMinDate = moment($('#callLogDate').val()).format();
    callLogFollowUpDate.set('minDate', callLogMinDate);
  } else {
    return false;
  }
}
listenSubmit('#createCallLogForm, #editCallLogForm', function () {
  $('.btnSave').attr('disabled', true);
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    $('.btnSave').attr('disabled', false);
    return false;
  }
});
listen('keyup keypress', '#createCallLogForm, #editCallLogForm', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
listen('keyup keypress', '#createCallLogForm, #editCallLogForm', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************!*\
  !*** ./resources/assets/js/visitors/visitor.js ***!
  \*************************************************/
document.addEventListener('turbo:load', loadVisitorData);
function loadVisitorData() {
  if (!$('#purposeArr').length) {
    return;
  }
  $('#purposeArr').select2({
    width: '100%'
  });
}
listenClick('.delete-visitor-btn', function (event) {
  event.preventDefault();
  var visitorId = $(event.currentTarget).attr('data-id');
  deleteItem($('.visitorUrl').val() + '/' + visitorId, '#visitorTbl', $('#visitorLang').val());
});
listenClick('#visitorResetFilter', function () {
  $('#visitorsHead').val(0).trigger('change');
  hideDropdownManually($('#visitorsFilterBtn'), $('.dropdown-menu'));
});
listenChange('#visitorsHead', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************!*\
  !*** ./resources/assets/js/visitors/create-edit.js ***!
  \*****************************************************/
document.addEventListener('turbo:load', loadVisitorFlatpickrData);
function loadVisitorFlatpickrData() {
  loadVisitorDate();
  loadVisitorOutTime();
}
function loadVisitorDate() {
  if (!$('#visitorDate').length) {
    return;
  }
  $('#visitorDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val()
  });
}
function loadVisitorOutTime() {
  if (!$('#visitorOutTime').length) {
    return;
  }
  $('#visitorInTime,#visitorOutTime').flatpickr({
    enableTime: true,
    enableSeconds: true,
    noCalendar: true,
    dateFormat: 'H:i:S',
    locale: $('.userCurrentLanguage').val()
  });
  $('#visitorOutTime').flatpickr({
    enableTime: true,
    enableSeconds: true,
    noCalendar: true,
    dateFormat: 'H:i:S',
    minTime: moment(new Date()).format('HH:mm:ss'),
    locale: $('.userCurrentLanguage').val()
  });
  $('#visitorPurpose').select2({
    width: '100%'
  });
}
listenSubmit('#createVisitorForm, #editVisitorForm', function () {
  if ($('.error-msg').text() !== '') {
    $('#visitorPhoneNumber').focus();
    return false;
  }
});
listen('keyup keypress', '#createVisitorForm, #editVisitorForm', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
$('#visitorInTime').on('dp.change', function (e) {
  $('#visitorOutTime').data('flatpickr').minTime(e.time);
});
listenChange('#visitorAttachment', function () {
  var extension = isValidVisitorDocument($(this), '#visitorErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#visitorErrorsBox').html('').hide();
    displayDocument(this, '#visitorPreviewImage', extension);
    $('#visitorSave').attr('disabled', false);
  }
  $('#visitorSave').attr('disabled', false);
});
window.isValidVisitorDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.document_must_be_file_type')).removeClass('d-none');
    return false;
  }
  $(validationMessageSelector).addClass('d-none');
  return ext;
};
listenClick('.visitor-remove-image', function () {
  defaultImagePreview('#visitorPreviewImage');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************!*\
  !*** ./resources/assets/js/postals/postal.js ***!
  \***********************************************/
document.addEventListener('turbo:load', loadPostal);
var addModal = $('.add_modal').val();
var editModal = $('.edit_modal').val();
var editPostalDate;
function loadPostal() {
  if (!$('.editPostalDate').length) {
    return;
  }
  $('.date, .editPostalDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    locale: $('.userCurrentLanguage').val()
  });
  editPostalDate = $('.editPostalDate').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: false,
    sideBySide: false,
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('.addPostalForm', function (event) {
  event.preventDefault();
  $('.btnPostalSave').attr('disabled', true);
  var loadingButton = jQuery(this).find('.btnPostalSave');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('.postalCreateUrl').val(),
    type: 'POST',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        if ($('#add_postal_receives_modal').length || $('#edit_postal_receives_modal').length) {
          $('#add_postal_receives_modal,#edit_postal_receives_modal').modal('hide');
        }
        if ($('#add_postal_dispatch_modal').length || $('#edit_postal_dispatch_modal').length) {
          $('#add_postal_dispatch_modal,#edit_postal_dispatch_modal').modal('hide');
        }
        Livewire.emit('refresh');
        setTimeout(function () {
          $('.btnPostalSave').attr('disabled', false);
          loadingButton.button('reset');
        }, 1000);
      }
    },
    error: function error(result) {
      printErrorMessage('.validationErrorsBox', result);
      setTimeout(function () {
        $('.btnPostalSave').attr('disabled', false);
        loadingButton.button('reset');
      }, 1000);
    }
  });
});
listenClick('.delete-postal-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  deleteItem($('.postalUrl').val() + '/' + id, '', $('.name').val());
});
listenClick('.edit-postal-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var postalId = event.currentTarget.dataset.id;
  postalRenderData(postalId);
});
function postalRenderData(id) {
  $.ajax({
    url: $('.postalUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        if (result.data.document_url != '') {
          var ext = result.data.document_url.split('.').pop().toLowerCase();
          if (ext === 'pdf') {
            $('.editPreviewImage').css('background-image', 'url("' + $('.pdfDocumentImageUrl').val() + '")');
          } else if (ext === 'docx' || ext === 'doc') {
            $('.editPreviewImage').css('background-image', 'url("' + $('.docxDocumentImageUrl').val() + '")');
          } else if (ext === '') {
            $('.editPreviewImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
          } else {
            $('.editPreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
          }
        }
        $($('.hiddenId').val()).val(result.data.id);
        $('.editFromTitle').val(result.data.from_title);
        editPostalDate.setDate(format(result.data.date, 'YYYY-MM-DD'));

        // $('#editDate').
        //     val(result.data.date ? format(result.data.date, 'YYYY-MM-DD') : '');
        $('.editReferenceNumber').val(result.data.reference_no);
        $('.editToTitle').val(result.data.to_title);
        $('.editAddress').val(result.data.address);
        if (isEmpty(result.data.document_url)) {
          $('.edit-attachment').addClass('d-none');
        } else {
          $('.documentUrl').attr('href', result.data.document_url);
        }
        if ($('#edit_postal_receives_modal').length) {
          $('#edit_postal_receives_modal').modal('show');
        }
        if ($('#edit_postal_dispatch_modal').length) {
          $('#edit_postal_dispatch_modal').modal('show');
        }
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
listenSubmit('.editPostalForm', function (event) {
  event.preventDefault();
  $('.btnEditSave').attr('disabled', true);
  var loadingButton = jQuery(this).find('.btnEditSave');
  loadingButton.button('loading');
  if ($('.isPostal').val() == 1) {
    if ($('.editFromTitle').val().trim().length === 0) {
      displayErrorMessage('The from title is required.');
      $('.btnEditSave').attr('disabled', false);
      return false;
    }
  }
  if ($('.isPostal').val() == 2) {
    if ($('.editToTitle').val().trim().length === 0) {
      displayErrorMessage('The to title is required.');
      $('.btnEditSave').attr('disabled', false);
      return false;
    }
  }
  var id = $($('.hiddenId').val()).val();
  var url = $('.postalUrl').val() + '/' + id;
  var data = {
    'formSelector': $(this),
    'url': url,
    'type': 'post',
    'tableSelector': $('.tableName').val()
  };
  if ($('#edit_postal_receives_modal').length) {
    editRecord(data, loadingButton, '#edit_postal_receives_modal');
    // $('#edit_postal_receives_modal').modal('hide')
  }
  if ($('#edit_postal_dispatch_modal').length) {
    editRecord(data, loadingButton, '#edit_postal_dispatch_modal');
    // $('#edit_postal_dispatch_modal').modal('hide')
  }
  $('.btnEditSave').attr('disabled', false);
});
listenChange('.postalAttachment', function () {
  var extension = postalIsValidDocument($(this), '.validationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('.validationErrorsBox').html('').hide();
    displayDocument(this, '.previewImage', extension);
  }
});
listenChange('.editAttachment', function () {
  if ($('#edit_postal_receives_modal').length) {
    var editModalAttachment = $('#edit_postal_receives_modal');
  }
  if ($('#edit_postal_dispatch_modal').length) {
    editModalAttachment = $('#edit_postal_dispatch_modal');
  }
  var extension = postalIsValidDocument($(this), '#editReceiveErrorsBox1');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '.editPreviewImage', extension);
  }
});
function postalIsValidDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html($('.documentError').val()).removeClass('hide');
    $(validationMessageSelector).removeAttr('style');
    return false;
  }
  $(validationMessageSelector).html($('.documentError').val()).addClass('hide');
  return ext;
}
listenClick('.remove-postal-image', function () {
  defaultImagePreview('.previewImage');
});
listenClick('.remove-postal-image-edit', function () {
  defaultImagePreview('.editPreviewImage');
});
listenHiddenBsModal('#add_postal_dispatch_modal', function () {
  resetModalForm('#addDispatchForm', '.validationErrorsBox');
  $('.previewImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#edit_postal_dispatch_modal', function () {
  resetModalForm('#editDispatchForm', '.editValidationErrorsBox1');
  $('.editPreviewImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#add_postal_receives_modal', function () {
  resetModalForm('#addReceiveForm', '.validationErrorsBox');
  $('.previewImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
});
listenHiddenBsModal('#edit_postal_receives_modal', function () {
  resetModalForm('#editReceiveForm', '.editValidationErrorsBox1');
  $('.editPreviewImage').css('background-image', 'url("' + $('.defaultDocumentImageUrl').val() + '")');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************!*\
  !*** ./resources/assets/js/appointments/patient_appointment.js ***!
  \*****************************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
document.addEventListener('turbo:load', loadPatientAppointmentData);
function loadPatientAppointmentData() {
  $('#status').select2();
}
listenClick('.appointment-delete-btn', function (event) {
  var appointmentId = $(event.currentTarget).attr('data-id');
  deleteItem($('#appointmentIndexURL').val() + '/' + appointmentId, '#appointmentsTbl', $('#appointmentLang').val());
});
listenClick('#resetAppointmentFilter', function () {
  timeRange.data('daterangepicker').setStartDate(moment().startOf('week').format('MM/DD/YYYY'));
  timeRange.data('daterangepicker').setEndDate(moment().endOf('week').format('MM/DD/YYYY'));
  startTime = timeRange.data('daterangepicker').startDate.format('YYYY-MM-D  H:mm:ss');
  endTime = timeRange.data('daterangepicker').endDate.format('YYYY-MM-D  H:mm:ss');
  $('#status').val(2).trigger('change');
  hideDropdownManually('.dropdown-menu,#dropdownMenuButton1');
});
var timeRange = $('#time_range');
var start = moment().subtract(29, 'days');
var end = moment();
var startTime = '';
var endTime = '';
function cb(start, end) {
  $('#time_range').html(start.format('MMM D, YYYY') + ' - ' + end.format('MMM D, YYYY'));
}
timeRange.daterangepicker({
  startDate: start,
  endDate: end,
  locale: {
    customRangeLabel: Lang.get('messages.common.custom'),
    applyLabel: Lang.get('messages.common.apply'),
    cancelLabel: Lang.get('messages.common.cancel'),
    fromLabel: Lang.get('messages.common.from'),
    toLabel: Lang.get('messages.common.to'),
    monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
    daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
  },
  ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.appointment.today'), [moment(), moment()]), Lang.get('messages.appointment.yesterday'), [moment().subtract(1, 'days'), moment().subtract(1, 'days')]), Lang.get('messages.appointment.last_7_days'), [moment().subtract(6, 'days'), moment()]), Lang.get('messages.appointment.last_30_days'), [moment().subtract(29, 'days'), moment()]), Lang.get('messages.appointment.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.appointment.last_month'), [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')])
}, cb);
cb(start, end);
timeRange.on('apply.daterangepicker', function (ev, picker) {
  startTime = picker.startDate.format('YYYY-MM-D  H:mm:ss');
  endTime = picker.endDate.format('YYYY-MM-D  H:mm:ss');
  window.livewire.emit('refresh');
  // $('#appointmentsTbl').DataTable().ajax.reload(null, true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./resources/assets/js/testimonials/testimonial.js ***!
  \*********************************************************/
document.addEventListener('turbo:load', loadTestimonialData);
function loadTestimonialData() {
  if (!$('#indexTestimonialUrl').length) {
    return;
  }
  $('.testimonialDescription').attr('maxlength', 150);
}
function renderTestimonialData(id) {
  $.ajax({
    url: $('#indexTestimonialUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.document_url.split('.').pop().toLowerCase();
        if (ext == '') {
          $('#editTestimonialPreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
        } else {
          $('#editTestimonialPreviewImage').css('background-image', 'url("' + result.data.document_url + '")');
        }
        $('#testimonialId').val(result.data.id);
        $('#editTestimonialName').val(result.data.name);
        $('#editTestimonialDescription').val(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#testimonialDocumentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#testimonialDocumentUrl').show();
          $('.btn-view').show();
          $('#testimonialDocumentUrl').attr('href', result.data.document_url);
        }
        $('#edit_testimonials').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
function isValidTestimonialDocument(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'gif', 'webp']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html($('#indexTestimonialProfileError').val()).removeClass('d-none');
    return false;
  }
  $(validationMessageSelector).html($('#indexTestimonialProfileError').val()).addClass('d-none');
  return ext;
}
listenSubmit('#addTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#testimonialSave');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#indexTestimonialCreateUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_testimonials').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#testimonialErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listen('click', '.edit-testimonial-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var testimonialId = $(event.currentTarget).attr('data-id');
  renderTestimonialData(testimonialId);
});
listenKeyup('.testimonialDescription', function () {
  $('.description').attr('maxlength', 150);
});
listenSubmit('#editTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editTestimonialSave');
  loadingButton.button('loading');
  var id = $('#testimonialId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#indexTestimonialUrl').val() + '/' + id,
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_testimonials').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_testimonials', function () {
  resetModalForm('#addTestimonialForm', '#add_testimonials #testimonialErrorsBox');
  $('#testimonialPreviewImage').attr('src', $('#indexTestimonialDefaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#indexTestimonialDefaultDocumentImageUrl').val(), ")"));
});
listenShownBsModal('#add_testimonials', function () {
  $('#add_testimonials #testimonialErrorsBox').show();
  $('#add_testimonials #testimonialErrorsBox').addClass('d-none');
});
listenHiddenBsModal('#edit_testimonials', function () {
  resetModalForm('#editTestimonialForm', '#edit_testimonials #editTestimonialErrorsBox');
  $('.editTestimonialPreviewImage').attr('src', $('#indexTestimonialDefaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#indexTestimonialDefaultDocumentImageUrl').val(), ")"));
});
listenShownBsModal('#edit_testimonials', function () {
  $('#edit_testimonials #editTestimonialErrorsBox').show();
  $('#edit_testimonials #editTestimonialErrorsBox').addClass('d-none');
});
listen('click', '.delete-testimonial-btn', function (event) {
  var testimonialId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexTestimonialUrl').val() + '/' + testimonialId, '', $('#testimonialLang').val());
});
listenChange('#testimonialProfile', function () {
  var extension = isValidTestimonialDocument($(this), '#add_testimonials #testimonialErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#testimonialPreviewImage', extension);
  }
});
listenChange('#editTestimonialProfile', function () {
  var extension = isValidTestimonialDocument($(this), '#edit_testimonials #editTestimonialErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#editTestimonialPreviewImage', extension);
  }
});
listen('click', '.view-testimonial-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var testimonialId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#indexTestimonialUrl').val() + '/' + testimonialId,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showTestimonialName').html('');
        $('#showTestimonialDescription').html('');
        $('#showTestimonialName').append(result.data.name);
        $('#showTestimonialDescription').append(result.data.description);
        $('#userProfilePicture').attr('src', result.data.document_url);
        $('#show_testimonials').appendTo('body').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************!*\
  !*** ./resources/assets/js/blood_donations/blood_donations.js ***!
  \****************************************************************/


document.addEventListener('turbo:load', loadBloodDonations);
function loadBloodDonations() {
  $('#bloodDonationsDonorName').select2({
    width: '100%',
    dropdownParent: $('#bloodDonationsAddModal')
  });
  $('#bloodDonationsEditDonorName').select2({
    width: '100%',
    dropdownParent: $('#bloodDonationsEditModal')
  });
  $('#bloodDonationsAddModal, #bloodDonationsEditModal').on('shown.bs.modal', function () {
    $('#bloodDonationsDonorName, #bloodDonationsEditDonorName:first').focus();
  });
}
listenSubmit('#bloodDonationsAddNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodDonationsBtnSave');
  loadingButton.button('loading');
  $('#bloodDonationsBtnSave').attr('disabled', true);
  $.ajax({
    url: $('#bloodDonationCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodDonationsAddModal').modal('hide');
        window.livewire.emit('refresh');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
        $('#bloodDonationsBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#bloodDonationsValidationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
      $('#bloodDonationsBtnSave').attr('disabled', false);
    }
  });
});
listenSubmit('#bloodDonationsEditForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodDonationsEditBtnSave');
  loadingButton.button('loading');
  $('#bloodDonationsEditBtnSave').attr('disabled', true);
  var id = $('#bloodDonationId').val();
  $.ajax({
    url: $('#bloodDonationUrl').val() + '/' + id,
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodDonationsEditModal').modal('hide');
        window.livewire.emit('refresh');
        $('#bloodDonationsEditBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#bloodDonationsEditBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#bloodDonationsAddModal', function () {
  $('#bloodDonationsDonorName').val('').trigger('change.select2');
  resetModalForm('#bloodDonationsAddNewForm', '#bloodDonationsValidationErrorsBox');
  $('#bloodDonationsBtnSave').attr('disabled', false);
});
listenHiddenBsModal('#bloodDonationsEditModal', function () {
  resetModalForm('#bloodDonationsEditForm', '#bloodDonationsEditValidationErrorsBox');
  $('#bloodDonationsEditBtnSave').attr('disabled', false);
});
listenClick('.blood-donations-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bloodDonationId = $(event.currentTarget).attr('data-id');
  bloodDonationRenderData(bloodDonationId);
});
function bloodDonationRenderData(id) {
  $.ajax({
    url: $('#bloodDonationUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var bloodDonation = result.data;
        $('#bloodDonationId').val(bloodDonation.id);
        $('#bloodDonationsEditDonorName').val(bloodDonation.blood_donor_id);
        $('#bloodDonationsEditDonorName').trigger('change');
        $('#editBags').val(bloodDonation.bags);
        $('#bloodDonationsEditModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
listenClick('.blood-donations-delete-btn', function (event) {
  var bloodDonationId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bloodDonationUrl').val() + '/' + bloodDonationId, '#bloodDonationTable', $('#bloodDonationLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**********************************************************!*\
  !*** ./resources/assets/js/blood_issues/blood_issues.js ***!
  \**********************************************************/


document.addEventListener('turbo:load', loaBloodIssues);
function loaBloodIssues() {
  $('#bloodIssuesDoctorName,#bloodIssuesPatientName,#bloodIssuesDonorName,#bloodIssuesBloodGroup').select2({
    width: '100%',
    dropdownParent: $('#bloodIssuesAddModal')
  });
  $('#editBloodIssueDoctorName,#editBloodIssuePatientName,#editBloodIssueDonorName,#editBloodIssueGroup').select2({
    width: '100%',
    dropdownParent: $('#bloodIssuesEditModal')
  });
  var issueDate = $('#bloodIssueDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    maxDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#bloodIssuesAddNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodIssuesBtnSave');
  loadingButton.button('loading');
  $('#bloodIssuesBtnSave').attr('disabled', true);
  $.ajax({
    url: $('#bloodIssueCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodIssuesAddModal').modal('hide');
        window.livewire.emit('refresh');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
        $('#bloodIssuesBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#bloodIssuesValidationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
      $('#bloodIssuesBtnSave').attr('disabled', false);
    }
  });
});
listenSubmit('#bloodIssuesEditForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#bloodIssuesEditBtnSave');
  loadingButton.button('loading');
  $('#bloodIssuesEditBtnSave').attr('disabled', true);
  var id = $('#bloodIssueId').val();
  $.ajax({
    url: $('#bloodIssueUrl').val() + '/' + id,
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#bloodIssuesEditModal').modal('hide');
        window.livewire.emit('refresh');
        $('#bloodIssuesEditBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#bloodIssuesEditBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.blood-issues-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var bloodIssueId = $(event.currentTarget).attr('data-id');
  bloodIssueRenderData(bloodIssueId);
});
function bloodIssueRenderData(id) {
  $.ajax({
    url: $('#bloodIssueUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var bloodIssue = result.data;
        $('#bloodIssueId').val(bloodIssue.id);
        var editIssueDate = $('#editBloodIssueDate').flatpickr({
          enableTime: true,
          maxDate: new Date(),
          dateFormat: 'Y-m-d H:i',
          locale: $('.userCurrentLanguage').val()
        });
        editIssueDate.setDate(bloodIssue.issue_date);
        $('#editBloodIssueDoctorName').val(bloodIssue.doctor_id).trigger('change');
        $('#editBloodIssuePatientName').val(bloodIssue.patient_id).trigger('change');
        $('#editBloodIssueDonorName').val(bloodIssue.donor_id).trigger('change', [{
          isEdit: true
        }]);
        $('#editBloodIssueAmount').val(bloodIssue.amount);
        $('.price-input').trigger('input');
        $('#editBloodIssueRemarks').val(bloodIssue.remarks);
        $('#bloodIssuesEditModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenChange('#bloodIssuesDonorName', function () {
  changeBloodGroup('#bloodIssuesBloodGroup', $(this).val());
});
listenChange('#editBloodIssueDonorName', function () {
  changeBloodGroup('#editBloodIssueGroup', $(this).val());
});
function changeBloodGroup(selector, id) {
  $.ajax({
    url: $('#bloodGroupUrl').val(),
    type: 'get',
    dataType: 'json',
    data: {
      id: id
    },
    success: function success(data) {
      $(selector).empty();
      $.each(data.data, function (i, v) {
        $(selector).append($('<option></option>').attr('value', i).text(v));
      });
    }
  });
}
listenHiddenBsModal('#bloodIssuesAddModal', function () {
  $('#bloodIssuesBtnSave').attr('disabled', false);
  resetModalForm('#bloodIssuesAddNewForm', '#bloodIssuesValidationErrorsBox');
});
listenHiddenBsModal('#bloodIssuesEditModal', function () {
  $('#bloodIssuesDtnSave').attr('disabled', false);
  resetModalForm('#bloodIssuesEditForm', '#editValidationErrorsBox');
});
listenClick('.blood-issues-delete-btn', function (event) {
  var bloodIssueId = $(event.currentTarget).attr('data-id');
  deleteItem($('#bloodIssueUrl').val() + '/' + bloodIssueId, '#bloodIssuesTable', $('#bloodIssueLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/live_consultations/live_consultations.js ***!
  \**********************************************************************/
document.addEventListener('turbo:load', loadConsultationData);
function loadConsultationData() {
  if (!$('#indexLiveConsultationUrl').length) {
    return;
  }
  listenShownBsModal('#add_consulatation_modal', function () {
    $('.doctor-name,.patient-name,.consultation-type,.consultation-type-number,.change-status').select2({
      width: '100%',
      dropdownParent: '#add_consulatation_modal'
    });
  });
  listenShownBsModal('#edit_consulatation_modal', function () {
    $('.edit-doctor-name,.edit-patient-name,.edit-consultation-type,.edit-consultation-type-number,.edit-change-status').select2({
      width: '100%',
      dropdownParent: '#edit_consulatation_modal'
    });
  });
  $('#liveConsultationFilterStatusArr').select2({
    width: '100%'
  });
  $('.consultation-date').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    minDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  $('.edit-consultation-date').flatpickr({
    enableTime: true,
    minDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
  $('.change-consultation-status').select2({
    width: '100%'
  });
}
listenHiddenBsModal('#add_consulatation_modal', function () {
  resetModalForm('#addConsultationForm', '#consultationErrorsBox');
  $('.consultation-type, .consultation-type-number').val('').trigger('change');
  $('select').each(function (index, element) {
    var drpSelector = '#' + $(this).attr('id');
    $(drpSelector).val('');
    $(drpSelector).prop('selectedIndex', 0).trigger('change');
  });
  $('#consultationTypeNumber').val(null).trigger('change');
  $('#consultationTypeNumber').append($('<option selected="selected" value="">Select Type Number</option>'));
});
listenHiddenBsModal('#edit_consulatation_modal', function () {
  resetModalForm('#editConsultationForm', '#editConsultationErrorsBox');
});
var consultationPatientId = null;
listenChange('.consultation-type, .edit-consultation-type', function () {
  changeConsultationTypeNumber('.consultation-type-number, .edit-consultation-type-number', $(this).val(), consultationPatientId);
});
listenChange('.patient-name, .edit-patient-name', function () {
  if ($(this).val() !== '') {
    consultationPatientId = $(this).val();
    $('.consultation-type-number, .edit-consultation-type-number').empty();
    $('.consultation-type-number, .edit-consultation-type-number').append('<option selected="selected" value="">' + Lang.get('messages.common.select_type_number') + '</option>');
    $('.consultation-type, .edit-consultation-type').removeAttr('disabled');
  }
});
function changeConsultationTypeNumber(selector, id, consultationPatientId) {
  if ($(selector).val() !== '') {
    $.ajax({
      url: $('#indexLiveConsultationTypeNumber').val(),
      type: 'get',
      dataType: 'json',
      data: {
        consultation_type: id,
        patient_id: consultationPatientId
      },
      success: function success(data) {
        if (data.data.length !== 0) {
          $(selector).empty();
          $(selector).removeAttr('disabled');
          $(selector).append('<option selected="selected" value="">' + Lang.get('messages.common.select_type_number') + '</option>');
          $.each(data.data, function (i, v) {
            $(selector).append($('<option></option>').attr('value', i).text(v));
          });
          $('.consultation-type-number').select2({
            width: '100%',
            dropdownParent: $('#add_consulatation_modal')
          });
          $('.edit-consultation-type-number').select2({
            width: '100%',
            dropdownParent: $('#edit_consulatation_modal')
          });
        } else {
          $(selector).empty();
          $(selector).append('<option selected="selected" value="">' + Lang.get('messages.common.select_type_number') + '</option>');
          $(selector).prop('disabled', true);
        }
      }
    });
  }
  $(selector).empty();
  $(selector).prop('disabled', true);
  $(selector).append('<option>Select Type Number</option>');
}
listenSubmit('#addConsultationForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#consultationSave');
  loadingButton.button('loading');
  $('#consultationSave').attr('disabled', true);
  $.ajax({
    url: $('#indexLiveConsultationCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_consulatation_modal').modal('hide');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
        $('#consultationSave').attr('disabled', false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#consultationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
      $('#consultationSave').attr('disabled', false);
    }
  });
});
listenSubmit('#editConsultationForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editConsultationSave');
  loadingButton.button('loading');
  $('#editConsultationSave').attr('disabled', true);
  var id = $('#liveConsultationId').val();
  $.ajax({
    url: $('#indexLiveConsultationUrl').val() + '/' + id,
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_consulatation_modal').modal('hide');
        // $('#liveConsultationTable').DataTable().ajax.reload(null, false);
        $('#editConsultationSave').attr('disabled', false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#editConsultationSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
function renderConsultationData(id) {
  $.ajax({
    url: $('#indexLiveConsultationUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveConsultation = result.data;
        $('#liveConsultationId').val(liveConsultation.id);
        $('.edit-consultation-title').val(liveConsultation.consultation_title);
        // document.querySelector('.edit-consultation-date').
        //     _flatpickr.
        //     setDate(moment(liveConsultation.consultation_date).format('YYYY-MM-DD h:mm A'));
        $('.edit-consultation-date').val(moment(liveConsultation.consultation_date).format('YYYY-MM-DD h:mm A'));
        $('.edit-consultation-duration-minutes').val(liveConsultation.consultation_duration_minutes);
        $('.edit-patient-name').val(liveConsultation.patient_id).trigger('change');
        $('.edit-doctor-name').val(liveConsultation.doctor_id).trigger('change');
        $('.host-enable,.host-disabled').prop('checked', false);
        if (liveConsultation.host_video == 1) {
          $("input[name=\"host_video\"][value=".concat(liveConsultation.host_video, "]")).prop('checked', true);
        } else {
          $("input[name=\"host_video\"][value=".concat(liveConsultation.host_video, "]")).prop('checked', true);
        }
        $('.client-enable,.client-disabled').prop('checked', false);
        if (liveConsultation.participant_video == 1) {
          $("input[name=\"participant_video\"][value=".concat(liveConsultation.participant_video, "]")).prop('checked', true);
        } else {
          $("input[name=\"participant_video\"][value=".concat(liveConsultation.participant_video, "]")).prop('checked', true);
        }
        $('.edit-consultation-type').val(liveConsultation.type).trigger('change');
        setTimeout(function () {
          $('.edit-consultation-type-number').val(liveConsultation.type_number).trigger('change');
        }, 1000);
        $('.edit-description').val(liveConsultation.description);
        $('#edit_consulatation_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenClick('.editConsultationBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var liveConsultationId = $(event.currentTarget).attr('data-id');
  renderConsultationData(liveConsultationId);
});
listenClick('.startConsultationBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var liveConsultationId = $(event.currentTarget).attr('data-id');
  startRenderConsultationData(liveConsultationId);
});
function startRenderConsultationData(id) {
  $.ajax({
    url: $('#indexLiveConsultationUrl').val() + '/' + id + '/start',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveConsultation = result.data;
        $('#startConsultationId').val(liveConsultation.liveConsultation.id);
        $('.start-modal-title').text(liveConsultation.liveConsultation.consultation_title);
        $('.host-name').text(liveConsultation.liveConsultation.user.full_name);
        $('.date').text(liveConsultation.liveConsultation.consultation_date);
        $('.minutes').text(liveConsultation.liveConsultation.consultation_duration_minutes);
        $('#startModal').find('.status').append(liveConsultation.zoomLiveData.status === 'started' ? $('.status').text('Started') : $('.status').text('Awaited'));
        $('.start').attr('href', $('#indexConsultationPatientRole').val() ? liveConsultation.liveConsultation.meta.join_url : liveConsultation.zoomLiveData.status === 'started' ? $('.start').addClass('disabled') : liveConsultation.liveConsultation.meta.start_url);
        if (liveConsultation.zoomLiveData.status === 'waiting') {
          $('.start').removeClass('disabled');
        }
        $('#startModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenClick('.deleteConsultationBtn', function (event) {
  var liveConsultationId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexLiveConsultationUrl').val() + '/' + liveConsultationId, '', $('#liveConsultationLang').val());
});
listenChange('.change-consultation-status', function () {
  var statusId = $(this).val();
  $.ajax({
    url: $('#indexLiveConsultationUrl').val() + '/change-status',
    type: 'GET',
    data: {
      statusId: statusId,
      id: $(this).attr('data-id')
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
        // $('#liveConsultationTable').DataTable().ajax.reload(null, false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listenClick('.showConsultationData', function (event) {
  var consultationId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#indexLiveConsultationUrl').val() + '/' + consultationId,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveConsultation = result.data.liveConsultation;
        var showModal = $('#show_live_consultations_modal');
        $('#startLiveConsultationId').val(liveConsultation.id);
        $('#showConsultationTitle').text(liveConsultation.consultation_title);
        $('#showConsultationDate').text(moment(liveConsultation.consultation_date).format('Do MMM, Y') + ' ' + moment(liveConsultation.consultation_date).format('LT'));
        $('#showConsultationDurationMinutes').text(liveConsultation.consultation_duration_minutes);
        $('#showConsultationPatient').text(liveConsultation.patient.patient_user.full_name);
        $('#showConsultationDoctor').text(liveConsultation.doctor.doctor_user.full_name);
        liveConsultation.type == 0 ? showModal.find('#showConsultationType').append('OPD') : showModal.find('#showConsultationType').append('IPD');
        liveConsultation.type == 0 ? showModal.find('#showConsultationTypeNumber').append(liveConsultation.opd_patient.opd_number) : showModal.find('#showConsultationTypeNumber').append(liveConsultation.ipd_patient.ipd_number);
        liveConsultation.host_video === 0 ? $('#showConsultationHostVideo').text('Disable') : $('#showConsultationHostVideo').text('Enable');
        liveConsultation.participant_video === 0 ? $('#showConsultationParticipantVideo').text('Disable') : $('#showConsultationParticipantVideo').text('Enable');
        isEmpty(liveConsultation.description) ? $('#showConsultationDescription').text('N/A') : $('#showConsultationDescription').text(liveConsultation.description);
        showModal.modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listenHiddenBsModal('#show_live_consultations_modal', function () {
  $(this).find('#showConsultationTitle, #showConsultationDate, #showConsultationDurationMinutes, #showConsultationPatient, #showConsultationDoctor, #showConsultationType, #showConsultationTypeNumber, #showConsultationHostVideo, #showConsultationParticipantVideo, #showConsultationDescription').empty();
});
listenClick('.add-credential', function () {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var userId = $('#zoomUserId').val();
  renderUserZoomData(userId);
});
function renderUserZoomData(id) {
  $.ajax({
    url: 'user-zoom-credential/' + id + '/fetch',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var userZoomData = result.data;
        if (!isEmpty(userZoomData)) {
          $('#zoomApiKey').val(userZoomData.zoom_api_key);
          $('#zoomApiSecret').val(userZoomData.zoom_api_secret);
          $('#zoomApiAccount').val(userZoomData.zoom_api_account);
        }
        $('#addCredential').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#addZoomForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnZoomSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#indexZoomCredentialCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addCredential').modal('hide');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      printErrorMessage('#credentialValidationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
    }
  });
});
listenChange('#liveConsultationFilterStatusArr', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#consultationResetFilter', function () {
  $('#liveConsultationFilterStatusArr').val(0).trigger('change');
  hideDropdownManually($('#liveConsultationFilterBtn'), $('.dropdown-menu'));
});
listenChange('.consultation-type', function () {
  $('.consultation-type-number').val('').trigger('change');
});
listenChange('.patient-name', function () {
  $('.consultation-type').val('').trigger('change');
  $('.consultation-type-number').trigger('change');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************!*\
  !*** ./resources/assets/js/live_consultations/live_meetings.js ***!
  \*****************************************************************/
document.addEventListener('turbo:load', loadMeetingData);
function loadMeetingData() {
  if (!$('#indexLiveMeetingUrl').length) {
    return;
  }
  $('.change-meeting-status').select2({
    width: '100%'
  });
  $('#meetingUserId, .change-meeting-status').select2({
    width: '100%'
  });
  $('.editUserId').select2({
    width: '100%'
  });
  $('.consultation-date, .edit-consultation-date').flatpickr({
    enableTime: true,
    minDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
}
listenSubmit('#addLiveMeetingForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#meetingSave');
  // loadingButton.button('loading');
  $('#meetingSave').attr('disabled', true);
  $.ajax({
    url: $('#indexLiveMeetingCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_live_meeting_modal').modal('hide');
        loadingButton.attr('disabled', false);
        // $('#liveMeetingTable').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
        $('.change-meeting-status').select2({
          width: '100%'
        });
        setTimeout(function () {
          loadingButton.attr('disabled', false);
        }, 3000);
      }
    },
    error: function error(result) {
      setTimeout(function () {
        loadingButton.attr('disabled', false);
      }, 2000);
      printErrorMessage('#meetingErrorsBox', result);
    }
  });
});
listenHiddenBsModal('#add_live_meeting_modal', function () {
  resetModalForm('#addLiveMeetingForm', '#meetingErrorsBox');
  $('#meetingUserId').val($('.loggedInUserId').val()).trigger('change.select2');
});
listenChange('.change-meeting-status', function () {
  var statusId = $(this).val();
  $.ajax({
    url: $('#indexLiveMeetingUrl').val() + '/change-status',
    type: 'GET',
    data: {
      statusId: statusId,
      id: $(this).attr('data-id')
    },
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        // $('#liveMeetingTable').DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listen('click', '.startMeetingBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var liveConsultationId = $(event.currentTarget).attr('data-id');
  renderStartMeetingData(liveConsultationId);
});
function renderStartMeetingData(id) {
  $.ajax({
    url: $('#indexLiveMeetingUrl').val() + '/' + id + '/start',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveConsultation = result.data;
        $('#startLiveConsultationId').val(liveConsultation.liveMeeting.id);
        $('.start-modal-title').text(liveConsultation.liveMeeting.consultation_title);
        $('.host-name').text(liveConsultation.liveMeeting.user.full_name);
        $('.date').text(liveConsultation.liveMeeting.consultation_date);
        $('.minutes').text(liveConsultation.liveMeeting.consultation_duration_minutes);
        $('#startConsultationModal').find('.status').append(liveConsultation.zoomLiveData.status === 'started' ? $('.status').text('Started') : $('.status').text('Awaited'));
        !($('#indexMeetingAdminRole').val() || $('#indexMeetingDoctorRole').val()) ? $('.start').attr('href', liveConsultation.liveMeeting.meta.join_url) : liveConsultation.zoomLiveData.status === 'started' ? $('.start').addClass('disabled') : $('.start').attr('href', liveConsultation.liveMeeting.meta.start_url);
        if (liveConsultation.zoomLiveData.status === 'waiting') {
          $('.start').removeClass('disabled');
        }
        $('#startConsultationModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listen('click', '.showMeetingData', function (event) {
  var meetingId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#indexLiveMeetingUrl').val() + '/' + meetingId,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveMeeting = result.data;
        $('#showMeetingId').val(liveMeeting.id);
        $('#showMeetingTitle').text(liveMeeting.consultation_title);
        $('#showMeetingDate').text(moment(liveMeeting.consultation_date).format('Do MMM, Y') + ' ' + moment(liveMeeting.consultation_date).format('LT'));
        $('#showMeetingMinutes').text(liveMeeting.consultation_duration_minutes);
        liveMeeting.host_video == 0 ? $('#showMeetingHost').text('Disable') : $('#showMeetingHost').text('Enable');
        liveMeeting.participant_video == 0 ? $('#showMeetingParticipant').text('Disable') : $('#showMeetingParticipant').text('Enable');
        isEmpty(liveMeeting.description) ? $('#showMeetingDescription').text('N/A') : $('#showMeetingDescription').text(liveMeeting.description);
        $('#show_live_meetings_modal').modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listen('click', '.editMeetingBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var liveMeetingId = $(event.currentTarget).attr('data-id');
  renderMeetingData(liveMeetingId);
});
function renderMeetingData(id) {
  $.ajax({
    url: $('#indexLiveMeetingUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var liveMeeting = result.data;
        $('#liveMeetingId').val(liveMeeting.id);
        $('.edit-consultation-title').val(liveMeeting.consultation_title);
        $('.edit-consultation-date').val(moment(liveMeeting.consultation_date).format('YYYY-MM-DD h:mm A'));
        $('.edit-consultation-duration-minutes').val(liveMeeting.consultation_duration_minutes);
        $('.editUserId').val(liveMeeting.meetingUsers).trigger('change.select2');
        $('.host-enable,.host-disabled').prop('checked', false);
        if (liveMeeting.host_video == 1) {
          $("input[name=\"host_video\"][value=".concat(liveMeeting.host_video, "]")).prop('checked', true);
        } else {
          $("input[name=\"host_video\"][value=".concat(liveMeeting.host_video, "]")).prop('checked', true);
        }
        $('.client-enable,.client-disabled').prop('checked', false);
        if (liveMeeting.participant_video == 1) {
          $("input[name=\"participant_video\"][value=".concat(liveMeeting.participant_video, "]")).prop('checked', true);
        } else {
          $("input[name=\"participant_video\"][value=".concat(liveMeeting.participant_video, "]")).prop('checked', true);
        }
        $('.edit-description').val(liveMeeting.description);
        $('#edit_live_meeting_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editMeetingForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editMeetingSave');
  loadingButton.button('loading');
  loadingButton.attr('disabled', true);
  var id = $('#liveMeetingId').val();
  $.ajax({
    url: $('#indexLiveMeetingUrl').val() + '/' + id,
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_live_meeting_modal').modal('hide');
        loadingButton.attr('disabled', false);
        // $('#liveMeetingTable').
        //     DataTable().
        //     ajax.
        //     reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      loadingButton.attr('disabled', false);
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listen('click', '.deleteMeetingBtn', function (event) {
  var liveMeetingId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexLiveMeetingUrl').val() + '/' + liveMeetingId, '', $('#liveMeetingLang').val());
});
listenHiddenBsModal('#show_live_meetings_modal', function () {
  $(this).find('#showMeetingTitle,#showMeetingDate, #showMeetingMinutes, #showMeetingHost, #showMeetingParticipant, #showMeetingDescription').empty();
});
listenChange('#liveMeetingFilterArrID', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('#liveMeetingResetFilter', function () {
  $('#liveMeetingFilterArrID').val(0).trigger('change');
  hideDropdownManually($('#liveMeetingFilterBtn'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/vaccinations/vaccinations.js ***!
  \**********************************************************/
listenSubmit('#addVaccinatedNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnVSave');
  loadingButton.button('loading');
  $.ajax({
    url: $('#vaccinationCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addVaccinatedModal').modal('hide');
        // $('#').DatvaccinationsTableaTable().ajax.reload(null, false);
        livewire.emit('refresh');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
    }
  });
});
listenHiddenBsModal('#addVaccinatedModal', function () {
  resetModalForm('#addVaccinatedNewForm', '#CreateVValidationErrorsBox');
});
listenClick('.edit-vaccinated-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var vaccinationId = $(event.currentTarget).attr('data-id');
  renderVaccinationData(vaccinationId);
});
window.renderVaccinationData = function (id) {
  $.ajax({
    url: $('#vaccinationUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var vaccination = result.data;
        $('#vaccinationId').val(vaccination.id);
        $('#editVaccinatedName').val(vaccination.name);
        $('#editManufacturedBy').val(vaccination.manufactured_by);
        $('#editVaccinatedBrand').val(vaccination.brand);
        $('#editVaccinatedModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editVaccinatedForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnEditVSave');
  loadingButton.button('loading');
  var id = $('#vaccinationId').val();
  $.ajax({
    url: $('#vaccinationUrl').val() + '/' + id + '/update',
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editVaccinatedModal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.delete-vaccination-btn', function (event) {
  var vaccinationId = $(event.currentTarget).attr('data-id');
  deleteItem($('#vaccinationUrl').val() + '/' + vaccinationId, '#vaccinationsTable', $('#vaccinationLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!************************************************************************!*\
  !*** ./resources/assets/js/vaccinated_patients/vaccinated_patients.js ***!
  \************************************************************************/


document.addEventListener('turbo:load', loadVaccinatedPatientData);
function loadVaccinatedPatientData() {
  $('#vaccinatedPatientName,#vPatientVaccinationName').select2({
    width: '100%',
    dropdownParent: $('#addVaccinatedPatientModal')
  });
  $('#editVaccinatedPatientName,#editVaccinationPatientName').select2({
    width: '100%',
    dropdownParent: $('#editVaccinatedPatientModal')
  });
  var doesDatePicker = $('#doesVPGivenDate,#editVPDoesGivenDate').flatpickr({
    enableTime: true,
    defaultDate: new Date(),
    dateFormat: 'Y-m-d H:i',
    locale: $('.userCurrentLanguage').val()
  });
}

// let editDoesDatePicker = $('#editVPDoesGivenDate').flatpickr({
//     enableTime: true,
//     dateFormat: 'Y-m-d H:i',
// });

listenShownBsModal('#addVaccinatedPatientModal', function () {
  // doesDatePicker.set('minDate', new Date());
  $('#doesVPGivenDate').val(moment().format('YYYY-MM-DD HH:mm'));
});
listenSubmit('#addVaccinatedPatientNewForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#btnVPSave');
  loadingButton.button('loading');
  $('#btnVPSave').attr('disabled', true);
  $.ajax({
    url: $('#vaccinatedPatientsStore').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addVaccinatedPatientModal').modal('hide');
        Livewire.emit('refresh');
        setTimeout(function () {
          loadingButton.button('reset');
        }, 2500);
        $('#btnVPSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      setTimeout(function () {
        loadingButton.button('reset');
      }, 2000);
      $('#btnVPSave').attr('disabled', false);
    }
  });
});
listenHiddenBsModal('#addVaccinatedPatientModal', function () {
  // doesDatePicker.close()
  $('#vaccinatedPatientName').val('').trigger('change');
  $('#vPatientVaccinationName').val('').trigger('change');
  resetModalForm('#addVaccinatedPatientNewForm', '#validationErrorsBox');
  $('#btnVPSave').attr('disabled', false);
});

// $('#editVaccinatedPatientModal').on('hidden.bs.modal', function () {
//     editDoesDatePicker.close()
// })

// let editDoesGivenDate = $('#editVPDoesGivenDate').flatpickr();

listenClick('.edit-vaccinated-patient-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var vaccinatedPatientId = $(event.currentTarget).attr('data-id');
  renderVaccinatedPatientData(vaccinatedPatientId);
});
window.renderVaccinatedPatientData = function (id) {
  $.ajax({
    url: $('#vaccinatedPatientsIndex').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var vaccinatedPatient = result.data;
        $('#vPatientId').val(vaccinatedPatient.id);
        $('#editVaccinatedPatientName').val(vaccinatedPatient.patient_id).trigger('change.select2');
        $('#editVaccinationPatientName').val(vaccinatedPatient.vaccination_id).trigger('change.select2');
        $('#editVPSerialNo').val(vaccinatedPatient.vaccination_serial_number);
        $('#editVPDoseNumber').val(vaccinatedPatient.dose_number);
        $('#editVPDoesGivenDate').val(moment(vaccinatedPatient.dose_given_date).utc().format('YYYY-MM-DD HH:mm:ss'));
        $('#editVPDescription').val(vaccinatedPatient.description);
        $('#editVaccinatedPatientModal').modal('show');
        ajaxCallCompleted();
        // editDoesDatePicker.set('minDate', $('#editVPDoesGivenDate').val());
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editVaccinatedPatientForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editVPBtnSave');
  loadingButton.button('loading');
  var id = $('#vPatientId').val();
  $('#editVPBtnSave').attr('disabled', true);
  $.ajax({
    url: $('#vaccinatedPatientsIndex').val() + '/' + id + '/update',
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editVaccinatedPatientModal').modal('hide');
        $('#editVPBtnSave').attr('disabled', false);
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#editVPBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.delete-vaccinated-patient-btn', function (event) {
  var vaccinatedPatientId = $(event.currentTarget).attr('data-id');
  deleteItem($('#vaccinatedPatientsIndex').val() + '/' + vaccinatedPatientId, '#vaccinatedPatientTable', $('#vaccinationPatientLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************************!*\
  !*** ./resources/assets/js/vaccinated_patients/patient_vaccinated.js ***!
  \***********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************!*\
  !*** ./resources/assets/js/users/user.js ***!
  \*******************************************/
listen('change', '#userStatusArr', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listen('change', '#userRoleArr', function () {
  window.livewire.emit('changeRoleFilter', 'roleFilter', $(this).val());
});
listenClick('.delete-user-btn', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexUserUrl').val() + '/' + userId, '#usersTable', $('#userLang').val());
});
listenClick('#resetUserFilter', function () {
  $('#userRoleArr').val(0).trigger('change');
  $('#userStatusArr').val(0).trigger('change');
  hideDropdownManually($('#userFilterButton'), $('.dropdown-menu'));
});
listenClick('.show-user-btn', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  renderUsersData(userId);
});
window.renderUsersData = function (id) {
  $.ajax({
    url: route('users.show.modal', id),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var _result$data$phone;
        $('#userFirstName').text(result.data.first_name);
        $('#userLastName').text(result.data.last_name);
        $('#userEmail').text(result.data.email);
        $('#userShowRole').text(result.data.department.name);
        $('#userPhone').text((_result$data$phone = result.data.phone) !== null && _result$data$phone !== void 0 ? _result$data$phone : 'N/A');
        $('#userGender').text(result.data.gender_string);
        $('#userDob').text('');
        if (result.data.dob != null) $('#userDob').text(moment(result.data.dob).format('Mo MMM, YYYY'));
        $('#userStatus').empty();
        if (result.data.status == 1) {
          $('#userStatus').append('<span class="badge bg-light-success">' + Lang.get('messages.common.active') + '</span>');
        } else {
          $('#userStatus').append('<span class="badge bg-light-danger">' + Lang.get('messages.filter.deactive') + '</span>');
        }
        $('#UserCreatedOn').text(moment(result.data.created_at).fromNow());
        $('#userUpdatedOn').text(moment(result.data.updated_at).fromNow());
        $('#userProfilePicture').attr('src', result.data.image_url);
        setValueOfEmptySpan();
        $('#showUser').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listen('change', '.is-verified-user', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#indexUserUrl').val() + '/' + userId + '/is-verified',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
      }
    }
  });
});
listen('change', '.user-status', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  updateUserStatus(userId);
});
window.updateUserStatus = function (id) {
  $.ajax({
    url: $('#indexUserUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/hospital_type/hospital_type.js ***!
  \************************************************************/
document.addEventListener('turbo:load', loadHospitalTypeData);
function loadHospitalTypeData() {}
listenSubmit('#addHospitalTypeForm', function (e) {
  e.preventDefault();
  var loadingButton = jQuery(this).find('#hospitalTypeSaveBtn');
  loadingButton.button('loading');
  $.ajax({
    url: $('.hospitalTypeCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#createHospitalTypeModal').modal('hide');
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.editHospitalTypeBtn', function (event) {
  var hospitalTypeId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: route('super.admin.hospitals.type.edit', hospitalTypeId),
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#editHospitalTypeId').val(result.data.id);
        $('#editHospitalTypeName').val(result.data.name);
        $('#editHospitalTypeModal').modal('show');
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listenSubmit('#editHospitalTypeForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editHospitalTypeSaveBtn');
  loadingButton.button('loading');
  var id = $('#editHospitalTypeId').val();
  $.ajax({
    url: route('super.admin.hospitals.type.update', id),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editHospitalTypeModal').modal('hide');
        window.livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.deleteHospitalTypeBtn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  // deleteItem($('#hospitalTypeEditUrl').val() + '/' + id, '',
  //     'Hospital Type')
  deleteItem(route('super.admin.hospitals.type.delete', id), '', 'Hospital Type');
});
listenHiddenBsModal('#createHospitalTypeModal', function () {
  resetModalForm('#addHospitalTypeForm');
});
listenHiddenBsModal('#editHospitalTypeModal', function () {
  resetModalForm('#editHospitalTypeForm');
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************!*\
  !*** ./resources/assets/js/users/create-edit.js ***!
  \**************************************************/


document.addEventListener('turbo:load', loadUserCreateEditData);
function loadUserCreateEditData() {
  if (!$('.userDoctorDepartment').length) {
    return false;
  }
  $('#userDob').flatpickr({
    format: 'YYYY-MM-DD',
    useCurrent: true,
    sideBySide: true,
    maxDate: new Date(),
    locale: $('.userCurrentLanguage').val()
  });
}
listenKeyup('#userFacebookUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#userTwitterUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#userInstagramUrl', function () {
  this.value = this.value.toLowerCase();
});
listenKeyup('#userLinkedInUrl', function () {
  this.value = this.value.toLowerCase();
});
listenSubmit('#createUserForm, #editUserForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }

  // $('#btnUserSave').attr('disabled', true)

  var facebookUrl = $('#userFacebookUrl').val();
  var twitterUrl = $('#userTwitterUrl').val();
  var instagramUrl = $('#userInstagramUrl').val();
  var linkedInUrl = $('#userLinkedInUrl').val();
  var facebookExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)facebook.[a-z]{2,3}\/?.*/i);
  var twitterExp = new RegExp(/^(https?:\/\/)?((m{1}\.)?)?((w{2,3}\.)?)twitter\.[a-z]{2,3}\/?.*/i);
  var instagramUrlExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)instagram.[a-z]{2,3}\/?.*/i);
  var linkedInExp = new RegExp(/^(https?:\/\/)?((w{2,3}\.)?)linkedin\.[a-z]{2,3}\/?.*/i);
  var facebookCheck = facebookUrl == '' ? true : facebookUrl.match(facebookExp) ? true : false;
  Lang.setLocale($('.userCurrentLanguage').val());
  if (!facebookCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_facebook_url'));
    setTimeout(function () {
      $('#btnUserSave').removeAttr('disabled');
    }, 3000);
    return false;
  }
  var twitterCheck = twitterUrl == '' ? true : twitterUrl.match(twitterExp) ? true : false;
  if (!twitterCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_twitter_url'));
    setTimeout(function () {
      $('#btnUserSave').removeAttr('disabled');
    }, 3000);
    return false;
  }
  var instagramCheck = instagramUrl == '' ? true : instagramUrl.match(instagramUrlExp) ? true : false;
  if (!instagramCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_Instagram_url'));
    setTimeout(function () {
      $('#btnUserSave').removeAttr('disabled');
    }, 3000);
    return false;
  }
  var linkedInCheck = linkedInUrl == '' ? true : linkedInUrl.match(linkedInExp) ? true : false;
  if (!linkedInCheck) {
    displayErrorMessage(Lang.get('messages.common.please_enter_valid_linkedin_url'));
    setTimeout(function () {
      $('#btnUserSave').removeAttr('disabled');
    }, 3000);
    return false;
  }
});
$('#createUserForm, #editUserForm').on('keyup keypress', function (e) {
  var keyCode = e.keyCode || e.which;
  if (keyCode === 13) {
    e.preventDefault();
    return false;
  }
});
$('#userDob').flatpickr({
  maxDate: new Date(),
  locale: $('.userCurrentLanguage').val()
});
listen('change', '#userProfileImage', function () {
  var extension = isValidDocument($(this), '#userValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#userValidationErrorsBox').html('').hide();
    displayDocument(this, '#userPreviewImage', extension);
  }
});
window.isValidDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg', 'pdf', 'doc', 'docx']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html(Lang.get('messages.new_change.image_must_be')).removeClass('display-none').show();
    setTimeout(function () {
      $(validationMessageSelector).slideUp(300);
    }, 5000);
    return false;
  }
  $(validationMessageSelector).addClass('display-none');
  return ext;
};

// listenSubmit('#createUserForm, #editUserForm', function () {
//     $('#btnUserSave').attr('disabled', true);
// });

listenClick('.remove-image', function () {
  defaultImagePreview('#userPreviewImage', 1);
});
if ($('#userRole').val() == 2) {
  $('.doctor_department').removeClass('d-none');
  $('#userDoctorDepartmentId').attr('required');
}
listenChange('#userRole', function () {
  var role = $(this).val();
  if (role == 2) {
    $('.doctor_department').removeClass('d-none');
    $('#userDoctorDepartmentId').attr('required');
  } else {
    $('.doctor_department').addClass('d-none');
    $('#userDoctorDepartmentId').removeAttr('required');
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/front_settings/front_settings.js ***!
  \**************************************************************/
listenChange('#aboutUsImage', function () {
  var extension = isValidFrontSettingImage($(this), '#aboutUsErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#aboutUsErrorsBox').html('').hide();
    displayDocument(this, '#aboutUsPreviewImage', extension);
  }
});
function isValidFrontSettingImage(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['jpg', 'png', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).removeClass('d-none');
    $(validationMessageSelector).html('The image must be a file of type: jpg, jpeg, png.').show();
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
}
;
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/accounts/accounts_details_edit.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************!*\
  !*** ./resources/assets/js/bed_types/bed_types_details_edit.js ***!
  \*****************************************************************/
listenHiddenBsModal('#editBedTypeModal', function () {
  resetModalForm('#editBedTypeForm', '#editValidationErrorsBox');
  $('#btnEditSave').attr('disabled', false);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/beds/beds-details-edit.js ***!
  \*******************************************************/
document.addEventListener('turbo:load', loadbedsData);
'use strict';
function loadbedsData() {
  var editBedTypeElement = $('#editBedType');
  if (editBedTypeElement.length) {
    $('#editBedType').select2({
      width: '100%',
      dropdownParent: $('#edit_beds_modal')
    });
  }
}
listenHiddenBsModal('#edit_beds_modal', function () {
  resetModalForm('#EditBedsForm', '#editValidationErrorsBox');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/document/document-details-edit.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!********************************************************************!*\
  !*** ./resources/assets/js/document_type/doc_type-details-edit.js ***!
  \********************************************************************/


listenClick('.editDocsTypeBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var docTypeId = $(event.currentTarget).attr('data-id');
  renderDocsTypeData(docTypeId);
});
function renderDocsTypeData(id) {
  $.ajax({
    url: $('#showDocTypeUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#docTypeId').val(result.data.id);
        $('#editDocTypeName').val(result.data.name);
        $('#edit_document_types_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
window.editDocumentTypeRecordWithForm = function (data, loadingButton) {
  var formData = data.formSelector === '' ? data.formData : $(data.formSelector).serialize();
  $(loadingButton).attr('disabled', true);
  $.ajax({
    url: data.url,
    type: data.type,
    data: formData,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_document_types_modal').modal('hide');
        setTimeout(function () {
          window.location.reload();
        }, 3000);
        $(loadingButton).attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $(loadingButton).attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************************************!*\
  !*** ./resources/assets/js/doctors_departments/doctors_departments-details-edit.js ***!
  \*************************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************************!*\
  !*** ./resources/assets/js/birth_reports/create-details-edit.js ***!
  \******************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************************!*\
  !*** ./resources/assets/js/death_reports/death_reports-details-edit.js ***!
  \*************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/operation_reports/create-details-edit.js ***!
  \**********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/category/category-details-edit.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************************************!*\
  !*** ./resources/assets/js/diagnosis_category/diagnosis_category-details-edit.js ***!
  \***********************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/expenses/expenses-details-edit.js ***!
  \***************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/charge_categories/create-details-edit.js ***!
  \**********************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************!*\
  !*** ./resources/assets/js/charges/create-details-edit.js ***!
  \************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************************!*\
  !*** ./resources/assets/js/notice_boards/create-details-edit.js ***!
  \******************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************!*\
  !*** ./resources/assets/js/incomes/incomes-details-edit.js ***!
  \*************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************!*\
  !*** ./resources/assets/js/front_settings/cms/create-edit.js ***!
  \***************************************************************/
// import Quill from 'quill';
document.addEventListener('turbo:load', loadFrontSettingCMSData);
function loadFrontSettingCMSData() {
  if (!$('#termConditionPrivacyPolicy').length) {
    return;
  }
  if (typeof $('#termConditionPrivacyPolicy').val() != 'undefined' && $('#termConditionPrivacyPolicy').val() == true) {
    var quill1 = new Quill('#termConditionId', {
      modules: {
        toolbar: [[{
          header: [1, 2, false]
        }], ['bold', 'italic', 'underline'], ['image', 'code-block']]
      },
      placeholder: Lang.get('messages.front_setting.terms_conditions'),
      theme: 'snow' // or 'bubble'
    });
    quill1.on('text-change', function (delta, oldDelta, source) {
      if (quill1.getText().trim().length === 0) {
        quill1.setContents([{
          insert: ''
        }]);
      }
    });
    var quill2 = new Quill('#privacyPolicyId', {
      modules: {
        toolbar: [[{
          header: [1, 2, false]
        }], ['bold', 'italic', 'underline'], ['image', 'code-block']]
      },
      placeholder: Lang.get('messages.web_home.privacy_policy'),
      theme: 'snow' // or 'bubble'
    });
    quill2.on('text-change', function (delta, oldDelta, source) {
      if (quill2.getText().trim().length === 0) {
        quill2.setContents([{
          insert: ''
        }]);
      }
    });
    var element = document.createElement('textarea');
    element.innerHTML = $('.termConditionData').val();
    quill1.root.innerHTML = element.value;
    element.innerHTML = $('.privacyPolicyData').val();
    quill2.root.innerHTML = element.value;
    listenSubmit('#termsAndCondition', function () {
      var element = document.createElement('textarea');
      var editor_content_1 = quill1.root.innerHTML;
      element.innerHTML = editor_content_1;
      var editor_content_2 = quill2.root.innerHTML;
      if (quill1.getText().trim().length === 0) {
        displayErrorMessage(Lang.get('messages.new_change.terms_condition_required'));
        return false;
      }
      if (quill2.getText().trim().length === 0) {
        displayErrorMessage(Lang.get('messages.new_change.privacy_policy'));
        return false;
      }
      $('#termData').val(editor_content_1.toString());
      $('#privacyData').val(editor_content_2.toString());
    });
  }
}
listenChange('.homePageImage', function () {
  var extension = isValidCmsImage($(this), '#homeErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#homeErrorsBox').html('').hide();
    displayDocument(this, '#homePreviewImage', extension);
  }
});
function isValidCmsImage(inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['jpg', 'png', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).removeClass('d-none');
    $(validationMessageSelector).html(Lang.get('messages.new_change.image_must_be')).show();
    return false;
  }
  $(validationMessageSelector).hide();
  return true;
}
;
listenSubmit('#addCMSForm', function () {
  var title = $('#homeTitleId').val();
  // let empty = title.trim().replace(/ \r\n\t/g, '') === '';
  var homePageExperience = $('#homePageExperience').val();
  var shortDescription = $('#homeShortDescription').val();
  var homePageBoxTitle = $('#homePageBoxTitle').val();
  var homePageBoxDes = $('#homePageBoxDes').val();
  var homeDoctorTextId = $('#homeDoctorTextId').val();
  var homeDoctorTitleId = $('#homeDoctorTitleId').val();
  var homeDoctorDescription = $('#homeDoctorDescription').val();
  var homePageCerBoxTl = $('#homePageCerBoxTl').val();
  var homePageCerBoxDes = $('#homePageCerBoxDes').val();
  var homePageStep1Tl = $('#homePageStep1Tl').val();
  var homePageStep1Des = $('#homePageStep1Des').val();
  var homePageStep2Tl = $('#homePageStep2Tl').val();
  var homePageStep2Des = $('#homePageStep2Des').val();
  var homePageStep3Tl = $('#homePageStep3Tl').val();
  var homePageStep3Des = $('#homePageStep3Des').val();
  var homePageStep4Tl = $('#homePageStep4Tl').val();
  var homePageStep4Des = $('#homePageStep4Des').val();
  if (isEmpty($.trim(homePageExperience))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_experience') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(title))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(shortDescription))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageBoxTitle))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_box_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageBoxDes))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_box_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homeDoctorTextId))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_certified_doctor_text') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homeDoctorTitleId))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_certified_doctor_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homeDoctorDescription))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_certified_doctor_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageCerBoxTl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_certified_box_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageCerBoxDes))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_certified_box_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep1Tl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_1_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep1Des))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_1_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep2Tl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_2_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep2Des))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_2_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep3Tl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_3_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep3Des))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_3_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep4Tl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_4_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep4Tl))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_4_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(homePageStep4Des))) {
    displayErrorMessage(Lang.get('messages.front_setting.home_page_step_4_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }

  // if (empty) {
  //     displayErrorMessage(
  //         'Home Page Title field is not contain only white space');
  //     return false;
  // }
});
listenSubmit('#createAboutUs', function () {
  var aboutUsTitle = $('#aboutUsTitle').val();
  var aboutUsDes = $('#aboutUsDes').val();
  var aboutUsMission = $('#aboutUsMission').val();
  if (isEmpty($.trim(aboutUsTitle))) {
    displayErrorMessage(Lang.get('messages.front_setting.about_us_title') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(aboutUsDes))) {
    displayErrorMessage(Lang.get('messages.front_setting.about_us_description') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
  if (isEmpty($.trim(aboutUsMission))) {
    displayErrorMessage(Lang.get('messages.front_setting.about_us_mission') + ' ' + Lang.get('messages.new_change.field_not_contain_white_space'));
    return false;
  }
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************************!*\
  !*** ./resources/assets/js/front_settings/front_services/front_services.js ***!
  \*****************************************************************************/
listenSubmit('#addFrontServiceForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#frontServiceSave');
  $('#frontServiceSave').attr('disabled', true);
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#indexFrontServicesUrl').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_front_service_modal').modal('hide');
        $('#frontServiceSave').attr('disabled', false);
        // $(tableName).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      $('#frontServiceSave').attr('disabled', false);
      printErrorMessage('#frontServiceErrorsBox', result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listen('click', '.editFrontServiceBtn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var frontServiceId = $(event.currentTarget).attr('data-id');
  renderFrontServiceData(frontServiceId);
});
function renderFrontServiceData(id) {
  $.ajax({
    url: $('#indexFrontServicesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#frontServiceId').val(result.data.id);
        if (result.data.icon_url) $('#editFrontServicePreviewImage').css('background-image', 'url("' + result.data.icon_url + '")');else $('#editFrontServicePreviewImage').css('background-image', 'url("' + $('#indexServiceDefaultDocumentImageUrl').val() + '")');
        $('#editFrontServiceName').val(result.data.name);
        $('#editFrontServiceDescription').val(result.data.short_description);
        if (isEmpty(result.data.icon_url)) {
          $('#frontServiceIconUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#frontServiceIconUrl').show();
          $('.btn-view').show();
          $('#frontServiceIconUrl').attr('href', result.data.icon_url);
        }
        $('#edit_front_service_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
;
listenSubmit('#editFrontServiceForm', function (event) {
  event.preventDefault();
  // let loadingButton = jQuery(this).find('#btnEditSave');
  // loadingButton.button('loading');
  var loadingButton = jQuery(this).find('#editFrontServiceSave');
  $('#editFrontServiceSave').attr('disabled', true);
  loadingButton.button('loading');
  var id = $('#frontServiceId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#indexFrontServicesUrl').val() + '/' + id,
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editFrontServiceSave').attr('disabled', false);
        $('#edit_front_service_modal').modal('hide');
        // $(tableName).DataTable().ajax.reload(null, false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      $('#editFrontServiceSave').attr('disabled', false);
      manageAjaxErrors(result);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#add_front_service_modal', function () {
  resetModalForm('#addFrontServiceForm', '#add_front_service_modal #frontServiceErrorsBox');
  $('#frontServiceSave').attr('disabled', false);
  $('#frontServicePreviewImage').attr('src', $('#indexServiceDefaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#indexServiceDefaultDocumentImageUrl').val(), ")"));
});
listenShownBsModal('#add_front_service_modal', function () {
  $('#add_front_service_modal #frontServiceErrorsBox').show();
  $('#add_front_service_modal #frontServiceErrorsBox').addClass('d-none');
});
listenHiddenBsModal('#edit_front_service_modal', function () {
  resetModalForm('#editFrontServiceForm', '#edit_front_service_modal #editFrontServiceErrorsBox');
  $('#editFrontServiceSave').attr('disabled', false);
  $('#editFrontServicePreviewImage').attr('src', $('#indexServiceDefaultDocumentImageUrl').val()).css('background-image', "url(".concat($('#indexServiceDefaultDocumentImageUrl').val(), ")"));
});
listenShownBsModal('#edit_front_service_modal', function () {
  $('#edit_front_service_modal #editFrontServiceErrorsBox').show();
  $('#edit_front_service_modal #editFrontServiceErrorsBox').addClass('d-none');
});
listen('click', '.deleteFrontServiceBtn', function (event) {
  var frontServiceId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexFrontServicesUrl').val() + '/' + frontServiceId, '', 'Service');
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*******************************************************!*\
  !*** ./resources/assets/js/super_admin/users/user.js ***!
  \*******************************************************/
document.addEventListener('turbo:load', loadSuperAdminUserData);
function loadSuperAdminUserData() {}
listenChange('.superUserStatus', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  updateHospitalStatus(userId);
});
window.updateHospitalStatus = function (id) {
  $.ajax({
    url: $('#userIndexUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenChange('.super-user-is-verified', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#userIndexUrl').val() + '/' + userId + '/is-verified',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    }
  });
});
listenClick('.super-user-delete-btn', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  deleteItem($('#hospitalIndexUrl').val() + '/' + userId, '#superAdminUsersTable', 'Hospital');
});
listenClick('.user-hospital-impersonate', function () {
  var id = $(this).data('id');
  var element = document.createElement('a');
  element.setAttribute('href', $('#impersonateRoute').val() + '/' + id);
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  $('.user-hospital-impersonate').prop('disabled', true);
});
listenClick('#resetHospitalFilter', function () {
  $('#hospitalStatusArr').val('').trigger('change');
  hideDropdownManually($('#hospitalFilterBtn'), $('.dropdown-menu'));
});
listenChange('#hospitalStatusArr', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************************!*\
  !*** ./resources/assets/js/super_admin/users/hospitals_data_listing.js ***!
  \*************************************************************************/
document.addEventListener('turbo:load', loadHospitalListingData);
function loadHospitalListingData() {}
listenClick('#hospitalUserResetFilter', function () {
  $('#roleArr, #statusArr').val(0).trigger('change');
  hideDropdownManually($('#hospitalUserFilterButton'), $('.dropdown-menu'));
});
listenChange('#statusArr', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('#roleArr', function () {
  window.livewire.emit('changeRoleFilter', 'roleFilter', $(this).val());
});
$(document).on('contextmenu', '.user-impersonate', function (e) {
  e.preventDefault(); // Stop right click on link
  return false;
});
var control = false;
$(document).on('keyup keydown', function (e) {
  control = e.ctrlKey;
});
$(document).on('click', '.user-impersonate', function () {
  if (control) {
    return false; // Stop ctrl + click on link
  }
  var id = $(this).data('id');
  var element = document.createElement('a');
  element.setAttribute('href', $('#showUserIndexURL').val() + '/' + id + '/login');
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
  $('.user-impersonate').prop('disabled', true);
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************!*\
  !*** ./resources/assets/js/admins/admins.js ***!
  \**********************************************/
document.addEventListener('turbo:load', loadAdminData);
function loadAdminData() {}
listenSubmit('#createAdminForm, #editAdminForm', function () {
  if ($('.error-msg').text() !== '') {
    $('.phoneNumber').focus();
    return false;
  }
});
listenClick('.admin-delete-btn', function (event) {
  var adminId = $(event.currentTarget).attr('data-id');
  deleteItem($('#adminUrl').val() + '/' + adminId, '', $('#Admin').val());
});
listenChange('.admin-status', function (event) {
  var adminId = $(event.currentTarget).attr('data-id');
  updateAdminStatus(adminId);
});
window.updateAdminStatus = function (id) {
  $.ajax({
    url: $('#adminUrl').val() + '/' + id + '/active-deactive',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/super_admin/users/billing.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadUserBillingData);
function loadUserBillingData() {}
function searchDataTable(table, selector) {
  var filterSearch = document.querySelector(selector);
  filterSearch.addEventListener('keyup', function (e) {
    table.search(e.target.value).draw();
  });
}
listenClick('.billing-modal', function (event) {
  var userId = $(event.currentTarget).attr('data-id');
  renderBillingData(userId);
});
window.renderBillingData = function (id) {
  $.ajax({
    url: $('#superAdminHospitalBillingModalID').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#plan_name').text(result.data[0].subscription_plan.name);
        $('#transaction').empty();
        if (result.data[0].transactions.payment_type == 1) {
          $('#transaction').append("<span class=\"badge bg-light-primary\">".concat($('#userStripeType').val(), "</span>"));
        } else {
          $('#transaction').append("<span class=\"badge bg-light-primary\">".concat($('#userPaypalType').val(), "</span>"));
        }
        $('#amount').text(result.data[0].plan_amount);
        $('#frequency').text(result.data[0].plan_frequency == 1 ? $('#userSubscriptionMonth').val() : $('#userSubscriptionYear').val());
        $('#start_date').text(moment(result.data[0].starts_at).format('Do MMM, Y'));
        $('#end_date').text(moment(result.data[0].ends_at).format('Do MMM, Y'));
        if (result.data[0].trial_ends_at) {
          $('#trail_end_date').text(moment(result.data[0].trial_ends_at).format('Do MMM, Y'));
        } else {
          $('#trail_end_date').text('N/A');
        }
        $('#status').empty();
        if (result.data[0].status == 1) {
          $('#status').append("<span class=\"badge bg-light-success\">".concat($('#userStatusActive').val(), "</span>"));
        } else {
          $('#status').append("<span class=\"badge bg-light-danger\">".concat($('#userStatusDeactive').val(), "</span>"));
        }
        setValueOfEmptySpan();
        $('#showBillingModal').appendTo('body').modal('show');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
};
listenClick('#hospitalBillsResetFilter', function () {
  $('#billingStatusArr').val(0).trigger('change');
  $('#billingPaymentType').val('').trigger('change');
  hideDropdownManually($('#hospitalBillsFilterButton'), $('.dropdown-menu'));
});
listenChange('#billingStatusArr', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('#billingPaymentType', function () {
  window.livewire.emit('changePaymentFilter', 'paymentFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/super_admin/users/transaction.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadUserTransactionDate);
function loadUserTransactionDate() {}
listenClick('#hospitalTransactionsResetFilter', function () {
  $('#paymentType').val('').trigger('change');
  hideDropdownManually($('#hospitalTransactionsFilterButton'), $('.dropdown-menu'));
});
listenChange('#paymentType', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/super_admin/users/create-edit.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadSuperAdminHospitalData);
function loadSuperAdminHospitalData() {
  listenSubmit('#createHospitalUserForm, #editHospitalUserForm', function () {
    if ($('.error-msg').text() !== '') {
      $('.phoneNumber').focus();
      return false;
    }
    $('.alert').delay(5000).slideUp(300);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************************************!*\
  !*** ./resources/assets/js/super_admin/subscription_plans/subscription_plan.js ***!
  \*********************************************************************************/
document.addEventListener('turbo:load', loadSubscriptionPlanData);
function loadSubscriptionPlanData() {}
listenClick('#resetSubscriptionPlanFilter', function () {
  $('#planTypeFilter').val('').trigger('change');
  hideDropdownManually($('#subscriptionPlanFilter'), $('.dropdown-menu'));
});
listenChange('#planTypeFilter', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenClick('.subscription-plan-delete-btn', function (e) {
  var subscriptionId = $(this).data('id');
  var deleteSubscriptionUrl = $('#subscriptionPlanUrl').val() + '/' + subscriptionId;
  deleteItem(deleteSubscriptionUrl, '#subscriptionPlanTable', $('#adminSubscriptionPlanLang').val());
});
listenClick('.subscription_plan_is_default', function (event) {
  var subscriptionPlanId = $(event.currentTarget).attr('data-id');
  updateStatusToDefault(subscriptionPlanId);
});
window.updateStatusToDefault = function (id) {
  $.ajax({
    url: $('#subscriptionPlanUrl').val() + '/' + id + '/make-plan-as-default',
    method: 'post',
    cache: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        livewire.emit('refresh');
      }
    }
  });
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***************************************************************************!*\
  !*** ./resources/assets/js/super_admin/subscription_plans/create-edit.js ***!
  \***************************************************************************/
document.addEventListener('turbo:load', loadPlansData);
function loadPlansData() {
  $('.price-input').trigger('input');
  if (!$('.currency').length) {
    return;
  }
  if (!$('.planType').length) {
    return;
  }
  $('.currency').select2();
  $('.planType').select2();
  checkSmsEnable();
  if ($('.sms-limit').is(':checked')) {
    $('.sms-limit-section').removeClass('d-none');
  } else {
    $('.sms-limit-section').addClass('d-none');
  }
  $(window).on('beforeunload', function () {
    $('input[type=submit]').prop('disabled', 'disabled');
  });
  $('#createSubscriptionPlanForm, #editSubscriptionPlanForm').find('input:text:visible:first').focus();
  listenSubmit('#createSubscriptionPlanForm, #editSubscriptionPlanForm', function () {
    $('#btnSave').attr('disabled', true);
  });
}
listenChange('.sms-limit , #selectAllPlanFeatures', function (event) {
  checkSmsEnable();
});
function checkSmsEnable() {
  if ($('.sms-limit').is(':checked')) {
    $('.sms-limit-section').removeClass('d-none');
  } else {
    $('.sms-limit-section').addClass('d-none');
  }
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*****************************************************************************!*\
  !*** ./resources/assets/js/super_admin/subscription_plans/plan_features.js ***!
  \*****************************************************************************/
document.addEventListener('turbo:load', loadPlanFeatureData);
function loadPlanFeatureData() {
  window.featureChecked = function (featureLength) {
    var totalFeature = $('.feature:checkbox').length;
    if (featureLength === totalFeature) {
      $('#selectAllPlanFeatures').prop('checked', true);
    } else {
      $('#selectAllPlanFeatures').prop('checked', false);
    }
  };

  // features selection script - starts
  var featureLength = $('.feature:checkbox:checked').length;
  featureChecked(featureLength);
  listenClick('#selectAllPlanFeatures', function () {
    if ($('#selectAllPlanFeatures').is(':checked')) {
      $('.feature').each(function () {
        $(this).prop('checked', true);
      });
    } else {
      $('.feature').each(function () {
        $(this).prop('checked', false);
      });
    }
  });
  listenClick('.feature', function () {
    var featureLength = $('.feature:checkbox:checked').length;
    featureChecked(featureLength);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/subscriptions/admin-free-subscription.js ***!
  \**********************************************************************/
document.addEventListener('turbo:load', loadSubscriptionPlansDate);
function loadSubscriptionPlansDate() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  listenClick('.freePayment', function () {
    var _this = this;
    if (typeof getLoggedInUserdata != 'undefined' && getLoggedInUserdata == '') {
      window.location.href = logInUrl;
      return true;
    }
    if ($(this).data('plan-price') === 0) {
      $(this).addClass('disabled');
      var data = {
        plan_id: $(this).data('id'),
        price: $(this).data('plan-price')
      };
      $.post(makePaymentURL, data).done(function (result) {
        displaySuccessMessage(result.message);
        setTimeout(function () {
          location.reload();
        }, 5000);
      })["catch"](function (error) {
        $(_this).html(subscribeText).removeClass('disabled');
        $('.freePayment').attr('disabled', false);
        displayErrorMessage(error.responseJSON.message);
      });
      return true;
    }
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*************************************************************************!*\
  !*** ./resources/assets/js/subscriptions/subscriptions-transactions.js ***!
  \*************************************************************************/
document.addEventListener('turbo:load', loadSubTransactionsData);
function loadSubTransactionsData() {
  listenChange('#paymentTypeArr', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
    // $(tableName).DataTable().ajax.reload(null, true);
  });
}
listenChange('.payment-approve', function () {
  var id = $(this).attr('data-id');
  var status = $(this).val();
  $.ajax({
    url: route('change-payment-status', id),
    type: 'GET',
    data: {
      id: id,
      status: status
    },
    success: function success(result) {
      displaySuccessMessage(result.message);
      window.livewire.emit('refresh');
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick('#transactionSideResetFilter', function () {
  $('#paymentTypeArr').val(7).trigger('change');
  hideDropdownManually($('#subscriptionTransaction'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************!*\
  !*** ./resources/assets/js/subscribe/subscribe.js ***!
  \****************************************************/
document.addEventListener('turbo:load', loadSubscribeDate);
function loadSubscribeDate() {
  listenClick('.subscribe-delete-btn', function () {
    var subscriberId = $(this).attr('data-id');
    deleteItem($('#superAdminSubscribeDestroy').val() + '/' + subscriberId, null, $('#subscribeLang').val());
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/service_slider/service-slider.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadServicesSliderData);
function loadServicesSliderData() {}
listenHiddenBsModal('#createServiceSliderModal', function () {
  // filename = null;
  $('#inputImage').removeClass('image-input-changed');
  $('#createServiceImage').val('');
  $('.previewImage').css('background-image', 'url(' + $('#defaultServiceSliderDocumentImageUrl').val() + ')');
  $('#serviceSliderSaveBtn').attr('disabled', false);
});
listenHiddenBsModal('#editServiceSliderModal', function () {
  // filename = null;
  $('#editInputImage').removeClass('image-input-changed');
  $('#editServiceImage').val('');
  $('#serviceSliderEditBtnSave').attr('disabled', false);
});
listenClick('#serviceSliderSaveBtn', function () {
  // e.preventDefault()

  // let loadingButton = jQuery(this).find('#testimonialSaveBtn');
  // loadingButton.button('loading');
  $('#serviceSliderSaveBtn').attr('disabled', true);
  $.ajax({
    url: $('#superAdminServiceSliderStore').val(),
    type: 'POST',
    data: new FormData($('#serviceSliderForm')[0]),
    contentType: false,
    processData: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#createServiceSliderModal').modal('hide');
        $('#serviceSliderSaveBtn').attr('disabled', false);
        setTimeout(function () {
          livewire.emit('refresh');
        }, 2000);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#serviceSliderSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      // loadingButton.button('reset');
    }
  });
});
listenClick('.service-slider-edit-btn', function (event) {
  var id = $(event.currentTarget).attr('data-id');
  renderServiceSliderData(id);
});
function renderServiceSliderData(id) {
  $.ajax({
    url: $('#superAdminServiceSliderIndex').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      $('#serviceId').val(result.data.id);
      $('#editDocumentImage').attr('src', result.data.image_url);
      $('#previewEditImage').css('background-image', 'url("' + result.data.image_url + '")');
      $('#editServiceSliderModal').modal('show');
    }
  });
}
listenChange('#serviceImage', function () {
  var extension = isValidFile($(this), '#serviceSliderValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#serviceSliderValidationErrorsBox').html('').hide();
    displayServicePhoto(this, '#previewImage', extension);
  }
});
listenChange('#editServiceImage', function () {
  var extension = isValidFile($(this), '#editServiceSliderValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    $('#editServiceSliderValidationErrorsBox').html('').hide();
    displayServicePhoto(this, '#previewEditImage', extension);
  }
});
listenClick('#serviceSliderEditBtnSave', function () {
  // event.preventDefault()
  // let loadingButton = jQuery(this).find('#serviceSliderEditBtnSave');
  // loadingButton.button('loading');
  $('#serviceSliderEditBtnSave').attr('disabled', true);
  // var formData = new FormData($('#serviceSliderEditForm'))
  var id = $('#serviceId').val();
  $.ajax({
    url: $('#superAdminServiceSliderIndex').val() + '/' + id,
    type: 'POST',
    data: new FormData($('#serviceSliderEditForm')[0]),
    // dataType    : 'json',
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editServiceSliderModal').modal('hide');
        $('#serviceSliderEditBtnSave').attr('disabled', false);
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
      $('#serviceSliderEditBtnSave').attr('disabled', false);
    }
  });
});
listenClick('.service-slider-delete-btn', function () {
  var serviceSliderId = $(this).attr('data-id');
  deleteItem($('#superAdminServiceSliderIndex').val() + '/' + serviceSliderId, null, $('#serviceSliderLang').val());
});
window.displayServicePhoto = function (input, selector) {
  var displayPreview = true;
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      var image = new Image();
      image.src = e.target.result;
      image.onload = function () {
        $(selector).attr('src', e.target.result);
        displayPreview = true;
      };
    };
    if (displayPreview) {
      reader.readAsDataURL(input.files[0]);
      $(selector).show();
    }
  }
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************!*\
  !*** ./resources/assets/js/faqs/faqs.js ***!
  \******************************************/
document.addEventListener('turbo:load', loadFAQData);
function loadFAQData() {}
listenSubmit('#addNewFAQForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#faqBtnSave');
  loadingButton.button('loading');
  $('#faqBtnSave').attr('disabled', true);
  $.ajax({
    url: $('#superAdminFAQStore').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#createFAQModal').modal('hide');
        livewire.emit('refresh');
        $('#faqBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#faqBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.faq-edit-btn', function (event) {
  var faqsId = $(event.currentTarget).attr('data-id');
  renderFaqData(faqsId);
});
listenClick('.faq-show-btn', function (event) {
  ajaxCallInProgress();
  var faqsId = $(event.currentTarget).attr('data-id');
  $.ajax({
    url: $('#superAdminFAQIndex').val() + '/' + faqsId,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        $('#showQuestion').text(result.data.question);
        $('#showAnswer').text(result.data.answer);
        $('#showFAQModal').modal('show');
        // ajaxCallCompleted();   
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
window.renderFaqData = function (id) {
  $.ajax({
    url: $('#superAdminFAQIndex').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      $('#faqsId').val(result.data.id);
      $('#editQuestion').val(result.data.question);
      $('#editAnswer').val(result.data.answer);
      $('#editFAQModal').modal('show');
      ajaxCallCompleted();
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenSubmit('#editFAQForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#faqBtnEditSave');
  loadingButton.button('loading');
  $('#faqBtnEditSave').attr('disabled', true);
  var id = $('#faqsId').val();
  $.ajax({
    url: $('#superAdminFAQIndex').val() + '/' + id,
    type: 'post',
    data: $(this).serialize(),
    success: function success(result) {
      displaySuccessMessage(result.message);
      $('#editFAQModal').modal('hide');
      livewire.emit('refresh');
      $('#faqBtnEditSave').attr('disabled', false);
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#faqBtnEditSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#createFAQModal', function () {
  resetModalForm('#addNewFAQForm', '#createFAQModal #validationErrorsBox');
  $('#faqBtnSave').attr('disabled', false);
});
listenHiddenBsModal('#editFAQModal', function () {
  resetModalForm('#editFAQForm', '#editFAQModal #editValidationErrorsBox');
  $('#faqBtnEditSave').attr('disabled', false);
});
listenClick('.faq-delete-btn', function (event) {
  var faqsId = $(event.currentTarget).attr('data-id');
  deleteItem($('#superAdminFAQIndex').val() + '/' + faqsId, $('#faqsTable'), $('#faqLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************************!*\
  !*** ./resources/assets/js/super_admin_enquiry/super_admin_enquiry.js ***!
  \************************************************************************/
document.addEventListener('turbo:load', loadSuperAdminEnquiryData);
function loadSuperAdminEnquiryData() {
  listenClick('.super-admin-enquiry-delete-btn', function (e) {
    var id = $(e.currentTarget).data('id');
    deleteItem($('#enquiryIndexUrl').val() + '/' + id, '#superAdminEnquiriesTable', $('#adminEnquiryLang').val());
  });
  listenClick('#resetAdminEnquiryFilter', function () {
    $('#super_admin_enquiry_filter').val(2).trigger('change');
    hideDropdownManually($('#adminEnquiriesFilterBtn'), $('.dropdown-menu'));
  });
  listenChange('#super_admin_enquiry_filter', function () {
    window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************************!*\
  !*** ./resources/assets/js/subscriptions/subscription-option.js ***!
  \******************************************************************/
document.addEventListener('turbo:load', loadSubscriptionOptionData);
function loadSubscriptionOptionData() {
  var options = {
    'key': $('.razorpayDataKey').val(),
    'amount': 1,
    //  100 refers to 1
    'currency': 'INR',
    'name': $('.razorpayDataName').val(),
    'order_id': '',
    'description': '',
    'image': $('.razorpayDataImage').val(),
    // logo here
    'callback_url': $('.razorpayDataCallBackURL').val(),
    'prefill': {
      'email': '',
      // recipient email here
      'name': '',
      // recipient name here
      'contact': '' // recipient phone here
    },
    'readonly': {
      'name': 'true',
      'email': 'true',
      'contact': 'true'
    },
    'modal': {
      'ondismiss': function ondismiss() {
        $.ajax({
          type: 'POST',
          url: $('.razorpayPaymentFailed').val(),
          success: function success(result) {
            if (result.url) {
              $.toast({
                heading: 'Success',
                icon: 'Success',
                bgColor: '#7603f3',
                textColor: '#ffffff',
                text: 'Payment not completed.',
                position: 'top-right',
                stack: false
              });
              setTimeout(function () {
                window.location.href = result.url;
              }, 3000);
            }
          },
          error: function error(result) {
            displayErrorMessage(result.responseJSON.message);
          }
        });
      }
    }
  };
  // console.log(options)
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!***********************************************************!*\
  !*** ./resources/assets/js/subscriptions/subscription.js ***!
  \***********************************************************/
document.addEventListener('turbo:load', loadSubscriptionData);
function loadSubscriptionData() {
  $.ajaxSetup({
    headers: {
      'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
  });
  if ($('#paymentType').val() == '') {
    $('.paypalPayment, .razor_pay_payment, .cash_payment, .paymentByPaytm, .paymentByPaystack').attr('disabled', true);
  }
}
function paymentMessage() {
  var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  // toastData = data != null ? data : toastData;
  toastData = data;
  if (toastData !== null) {
    setTimeout(function () {
      $.toast({
        heading: toastData.toastType,
        icon: toastData.toastType,
        bgColor: 'danger',
        textColor: '#ffffff',
        text: toastData.toastMessage,
        position: 'top-right',
        stack: false
      });
    }, 1000);
  }
}
listenClick('.makePayment', function () {
  var _this = this;
  if (typeof $('.getLoggedInUserdata').val() != 'undefined' && $('.getLoggedInUserdata').val() == '') {
    window.location.href = $('.logInUrl').val();
    return true;
  }
  var payloadData = {
    plan_id: $(this).data('id'),
    from_pricing: typeof $('.fromPricing').val() != 'undefined' ? $('.fromPricing').val() : null,
    price: $(this).data('plan-price'),
    payment_type: $('#paymentType option:selected').val()
  };
  $(this).addClass('disabled');
  $.post($('.makePaymentURL').val(), payloadData).done(function (result) {
    if (typeof result.data == 'undefined') {
      var toastMessageData = {
        'toastType': 'success',
        'toastMessage': result.message
      };
      paymentMessage(toastMessageData);
      setTimeout(function () {
        window.location.href = $('.subscriptionPlans').val();
      }, 5000);
      return true;
    }

    // let stripe = $('.stripe').val()
    var sessionId = result.data.sessionId;
    stripe.redirectToCheckout({
      sessionId: sessionId
    }).then(function (result) {
      $(this).html($('.subscribeText').val()).removeClass('disabled');
      $('.makePayment').attr('disabled', false);
      var toastMessageData = {
        'toastType': 'error',
        'toastMessage': result.responseJSON.message
      };
      paymentMessage(toastMessageData);
    });
  })["catch"](function (error) {
    $(_this).html($('.subscribeText').val()).removeClass('disabled');
    $('.makePayment').attr('disabled', false);
    var toastMessageData = {
      'toastType': 'error',
      'toastMessage': error.responseJSON.message
    };
    paymentMessage(toastMessageData);
  });
});
listenChange('#paymentType', function () {
  var paymentType = $(this).val();
  if (paymentType == '') {
    $('.makePayment,.paymentByPaypal, .razor_pay_payment, .cash_payment, .paymentByPaytm, .paymentByPaystack').attr('disabled', true);
  }
  if (paymentType == 1) {
    $('.proceed-to-payment, .razorPayPayment, .cashPayment, .paytmPayment, .paystackPayment,.manuallyPayAttachment').addClass('d-none');
    $('.stripePayment').removeClass('d-none');
    $('.makePayment').attr('disabled', false);
  }
  if (paymentType == 2) {
    $('.proceed-to-payment, .razorPayPayment, .cashPayment, .paytmPayment, .paystackPayment,.manuallyPayAttachment').addClass('d-none');
    $('.paypalPayment').removeClass('d-none');
    $('.paymentByPaypal').attr('disabled', false);
  }
  if (paymentType == 3) {
    $('.proceed-to-payment, .paypalPayment, .cashPayment, .paytmPayment, .paystackPayment,.manuallyPayAttachment').addClass('d-none');
    $('.razorPayPayment').removeClass('d-none');
    $('.razor_pay_payment').attr('disabled', false);
  }
  if (paymentType == 4) {
    $('.proceed-to-payment, .paypalPayment, .razorPayPayment, .paytmPayment, .paystackPayment').addClass('d-none');
    $('.cashPayment').removeClass('d-none');
    $('.manuallyPayAttachment').removeClass('d-none');
    $('.cash_payment').attr('disabled', false);
  }
  if (paymentType == 5) {
    $('.proceed-to-payment, .paypalPayment, .razorPayPayment, .cashPayment, .paystackPayment,.manuallyPayAttachment').addClass('d-none');
    $('.paytmPayment').removeClass('d-none');
    $('.paymentByPaytm').attr('disabled', false);
  }
  if (paymentType == 6) {
    $('.proceed-to-payment, .paypalPayment, .razorPayPayment, .cashPayment, .paytmPayment,.manuallyPayAttachment').addClass('d-none');
    $('.paystackPayment').removeClass('d-none');
    $('.paymentByPaystack').attr('disabled', false);
  }
});
listenClick('.paymentByPaypal', function () {
  var pricing = typeof $('.fromPricing').val() != 'undefined' ? $('.fromPricing').val() : null;
  $(this).addClass('disabled');
  $.ajax({
    type: 'GET',
    url: route('paypal.init'),
    data: {
      'planId': $(this).data('id'),
      'from_pricing': pricing,
      'payment_type': $('#paymentType option:selected').val()
    },
    success: function success(result) {
      if (result.success) {
        var toastMessageData = {
          'toastType': 'success',
          'toastMessage': result.message
        };
        paymentMessage(toastMessageData);
        setTimeout(function () {
          window.location.href = $('.subscriptionPlans').val();
        }, 5000);
        return true;
      }
      if (result.url) {
        window.location.href = result.url;
      }
      if (result.status == 201) {
        var redirectTo = '';
        location.href = result.link;

        // $.each(result.result.links,
        //     function (key, val) {
        //         if (val.rel == 'approve') {
        //             redirectTo = val.href
        //         }
        //     })
        // location.href = redirectTo
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});
listenClick('.paymentByPaytm', function () {
  var pricing = typeof $('.fromPricing').val() != 'undefined' ? $('.fromPricing').val() : null;
  window.location.replace(route('paytm.init', {
    'planId': $(this).data('id'),
    'from_pricing': pricing
  }));
});
var options = {
  'key': $('.razorpayDataKey').val(),
  'amount': 1,
  //  100 refers to 1
  'currency': 'INR',
  'name': $('.razorpayDataName').val(),
  'order_id': '',
  'description': '',
  'image': $('.razorpayDataImage').val(),
  // logo here
  'callback_url': route('razorpay.success'),
  'prefill': {
    'email': '',
    // recipient email here
    'name': '',
    // recipient name here
    'contact': '' // recipient phone here
  },
  'readonly': {
    'name': 'true',
    'email': 'true',
    'contact': 'true'
  },
  'modal': {
    'ondismiss': function ondismiss() {
      $.ajax({
        type: 'POST',
        url: $('.razorpayPaymentFailed').val(),
        success: function success(result) {
          if (result.url) {
            $.toast({
              heading: 'Success',
              icon: 'Success',
              bgColor: '#7603f3',
              textColor: '#ffffff',
              text: 'Payment not completed.',
              position: 'top-right',
              stack: false
            });
            setTimeout(function () {
              window.location.href = result.url;
            }, 3000);
          }
        },
        error: function error(result) {
          displayErrorMessage(result.responseJSON.message);
        }
      });
    }
  }
};
listenClick('.razor_pay_payment', function () {
  $(this).addClass('disabled');
  $.ajax({
    type: 'POST',
    url: $('.makeRazorpayURl').val(),
    data: {
      'plan_id': $(this).data('id'),
      'from_pricing': typeof $('.fromPricing').val() != 'undefined' ? $('.fromPricing').val() : null
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
      if (result.success) {
        var _result$data = result.data,
          id = _result$data.id,
          amount = _result$data.amount,
          name = _result$data.name,
          email = _result$data.email,
          contact = _result$data.contact,
          planID = _result$data.planID;
        options.amount = amount;
        options.order_id = id;
        options.prefill.name = name;
        options.prefill.email = email;
        options.prefill.contact = contact;
        options.prefill.planID = planID;
        var razorPay = new Razorpay(options);
        razorPay.open();
        razorPay.on('payment.failed', storeFailedPayment);
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});
function storeFailedPayment(response) {
  $.ajax({
    type: 'POST',
    url: $('.razorpayPaymentFailed').val(),
    data: {
      data: response
    },
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
}
listenClick('.cash_payment', function () {
  $(this).addClass('disabled');
  var formData = new FormData($('.manuallyPaymentForm')[0]);
  $.ajax({
    type: 'POST',
    url: $('.cashPaymentUrl').val(),
    // data: new FormData({
    //     'plan_id': $(this).data('id'),
    //     'from_pricing': typeof $('.fromPricing').val() != 'undefined'
    //         ? $('.fromPricing').val()
    //         : null,
    //     'notes': $('.notes').val(),
    // }),
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.url) {
        window.location.href = result.url;
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    },
    complete: function complete() {}
  });
});
listenClick('.paymentByPaystack', function () {
  var pricing = typeof $('.fromPricing').val() != 'undefined' ? $('.fromPricing').val() : null;
  window.location.replace(route('paystack.init', {
    'planId': $(this).data('id'),
    'from_pricing': pricing
  }));
});
listenClick('#resetSubscriptionFilter', function () {
  $('#subscriptionStatusFilter').val('').trigger('change');
  $('#subscriptionExpireStatusFilter').val('').trigger('change');
  hideDropdownManually($('#subscriptionFilter'), $('.dropdown-menu'));
});
listenChange('#subscriptionStatusFilter', function () {
  window.livewire.emit('changeFilter', 'statusFilter', $(this).val());
});
listenChange('#subscriptionExpireStatusFilter', function () {
  window.livewire.emit('changeExpireFilter', 'expireStatusFilter', $(this).val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************************!*\
  !*** ./resources/assets/js/super_admin_testimonial/testimonial.js ***!
  \********************************************************************/
document.addEventListener('turbo:load', loadTestimonialData);
function loadTestimonialData() {}
listenSubmit('#addNewTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#testimonialBtnSave');
  loadingButton.button('loading');
  var formData = new FormData($(this)[0]);
  $('#testimonialBtnSave').attr('disabled', true);
  $.ajax({
    url: $('#superAdminTestimonialStore').val(),
    type: 'POST',
    dataType: 'json',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addTestimonialModal').modal('hide');
        window.livewire.emit('refresh');
        $('#testimonialBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#validationErrorsBox', result);
      $('#testimonialBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenClick('.testimonial-show-btn', function () {
  var id = $(this).attr('data-id');
  $.ajax({
    url: $('#superAdminTestimonialIndex').val() + '/' + id,
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.image_url.split('.').pop().toLowerCase();
        if (ext == '') {
          $('#showPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        } else {
          $('#showPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        }
        $('.show-name').text(result.data.name);
        $('.show-position').text(result.data.position);
        $('.show-description').text(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#documentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#documentUrl').show();
          $('.btn-view').show();
          $('#documentUrl').attr('href', result.data.document_url);
        }
        $('#showModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
});
listenClick('.testimonial-edit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var testimonialId = $(event.currentTarget).attr('data-id');
  renderTestimonialData(testimonialId);
});
window.renderTestimonialData = function (id) {
  $.ajax({
    url: $('#superAdminTestimonialIndex').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var ext = result.data.image_url.split('.').pop().toLowerCase();
        if (ext == '') {
          $('#editPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        } else {
          $('#editPreviewImage').css('background-image', 'url("' + result.data.image_url + '")');
        }
        $('#testimonialId').val(result.data.id);
        $('#editName').val(result.data.name);
        $('#editPosition').val(result.data.position);
        $('#editDescription').val(result.data.description);
        if (isEmpty(result.data.document_url)) {
          $('#documentUrl').hide();
          $('.btn-view').hide();
        } else {
          $('#documentUrl').show();
          $('.btn-view').show();
          $('#documentUrl').attr('href', result.data.document_url);
        }
        $('#editTestimonialModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
//
$('.description').on('keyup', function () {
  $('.description').attr('maxlength', 150);
});
$('.description').attr('maxlength', 150);
listenSubmit('#editAdminTestimonialForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editTestimonialBtnSave');
  loadingButton.button('loading');
  $('#editTestimonialBtnSave').attr('disabled', true);
  var id = $('#testimonialId').val();
  var formData = new FormData($(this)[0]);
  $.ajax({
    url: $('#superAdminTestimonialIndex').val() + '/' + id,
    type: 'post',
    data: formData,
    processData: false,
    contentType: false,
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editTestimonialModal').modal('hide');
        livewire.emit('refresh');
        $('#editTestimonialBtnSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
      $('#editTestimonialBtnSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addTestimonialModal', function () {
  resetModalForm('#addNewTestimonialForm', '#addTestimonialModal #validationErrorsBox');
  $('#previewImage').attr('src', $('#testimonialDefaulImageURL').val()).css('background-image', "url(".concat($('#testimonialDefaulImageURL').val(), ")"));
  $('#testimonialBtnSave').attr('disabled', false);
});
listenShownBsModal('#addTestimonialModal', function () {
  $('#addTestimonialModal #validationErrorsBox').show();
  $('#addTestimonialModal #validationErrorsBox').addClass('d-none');
});
listenHiddenBsModal('#editTestimonialModal', function () {
  resetModalForm('#editAdminTestimonialForm', '#editTestimonialModal #editValidationErrorsBox');
  $('#previewImage').attr('src', $('#testimonialDefaulImageURL').val()).css('background-image', "url(".concat($('#testimonialDefaulImageURL').val(), ")"));
  $('#editTestimonialBtnSave').attr('disabled', false);
});
listenShownBsModal('#editTestimonialModal', function () {
  $('#editTestimonialModal #editValidationErrorsBox').show();
  $('#editTestimonialModal #editValidationErrorsBox').addClass('d-none');
});
listenClick('.testimonial-delete-btn', function (event) {
  var testimonialId = $(event.currentTarget).attr('data-id');
  deleteItem(route('admin-testimonial.destroy', testimonialId), $('#AdminTestimonialTbl'), $('#adminTestimonialLang').val());
});
listenChange('#profile', function () {
  var extension = isValidDocument($(this), '#addTestimonialModal #validationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#previewImage', extension);
  }
});
listenChange('#editProfile', function () {
  var extension = isValidDocument($(this), '#editTestimonialModal #editValidationErrorsBox');
  if (!isEmpty(extension) && extension != false) {
    displayDocument(this, '#editPreviewImage', extension);
  }
});
window.isValidDocument = function (inputSelector, validationMessageSelector) {
  var ext = $(inputSelector).val().split('.').pop().toLowerCase();
  if ($.inArray(ext, ['png', 'jpg', 'jpeg']) == -1) {
    $(inputSelector).val('');
    $(validationMessageSelector).html($('#testimonialProfileError').val()).removeClass('d-none');
    return false;
  }
  $(validationMessageSelector).html($('#testimonialProfileError').val()).addClass('d-none');
  return ext;
};
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************************!*\
  !*** ./resources/assets/js/landing/languageChange/languageChange.js ***!
  \**********************************************************************/
$(document).ready(function () {
  $(document).on('click', '.languageSelection', function () {
    var changeLanguageName = $(this).attr('data-prefix-value');
    $.ajax({
      headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
      },
      type: 'POST',
      url: '/language-change-name',
      data: {
        languageName: changeLanguageName
      },
      success: function success() {
        location.reload();
      }
    });
  });
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!******************************************************************************!*\
  !*** ./resources/assets/js/employee_prescriptions/employee_prescriptions.js ***!
  \******************************************************************************/

})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!****************************************************************!*\
  !*** ./resources/assets/js/super_admin/dashboard/dashboard.js ***!
  \****************************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
document.addEventListener('turbo:load', loadSuperAdminDashboardData);
function loadSuperAdminDashboardData() {
  var superAdminDashboardElement = $('.super-admin-dashboard');
  if (!superAdminDashboardElement.length) {
    return;
  }
  var chartType = 'line';
  var today = moment();
  var start = today.clone().startOf('month');
  var end = today.clone().endOf('month');
  function cb(start, end) {
    $('#chartFilter').html(start + ' - ' + end);
  }
  $('#chartFilter').daterangepicker({
    startDate: start,
    endDate: end,
    locale: {
      format: 'D/MM/Y',
      customRangeLabel: Lang.get('messages.common.custom'),
      applyLabel: Lang.get('messages.common.apply'),
      cancelLabel: Lang.get('messages.common.cancel'),
      fromLabel: Lang.get('messages.common.from'),
      toLabel: Lang.get('messages.common.to'),
      monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
      daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
    },
    ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.appointment.today'), [moment(), moment()]), Lang.get('messages.appointment.yesterday'), [moment().subtract(1, 'days'), moment().subtract(1, 'days')]), Lang.get('messages.appointment.last_7_days'), [moment().subtract(6, 'days'), moment()]), Lang.get('messages.appointment.last_30_days'), [moment().subtract(29, 'days'), moment()]), Lang.get('messages.appointment.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.appointment.last_month'), [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')])
  }, cb);
  cb(start, end);
  var startDate;
  var endDate;
  setTimeout(function () {
    startDate = start.format('DD-MM-YYYY');
    endDate = end.format('DD-MM-YYYY');
    setIncomeReport(startDate, endDate);
  }, 1000);
  var startNewDate;
  var endNewDate;
  $('#chartFilter').on("apply.daterangepicker", function (ev, picker) {
    start = picker.startDate.format("YYYY-MM-D");
    end = picker.endDate.format("YYYY-MM-D");
    setIncomeReport(start, end);
  });

  // listenChange('#chartFilter', function () {
  //     let date = $(this).val().split('-')
  //     startNewDate = moment(new Date(date[0])).format('DD-MM-YYYY')
  //     endNewDate = moment(new Date(date[1])).format('DD-MM-YYYY')
  //     setIncomeReport(startNewDate, endNewDate)
  // })

  listenClick('#changeChart', function () {
    if (chartType == 'line') {
      chartType = 'bar';
      $('.chart').removeClass('fa-chart-bar');
      $('.chart').addClass('fa-chart-line');
      if (!startNewDate) {
        setIncomeReport(startDate, endDate);
      } else {
        setIncomeReport(startNewDate, endNewDate);
      }
    } else {
      chartType = 'line';
      $('.chart').addClass('fa-chart-bar');
      $('.chart').removeClass('fa-chart-line');
      if (!startNewDate) {
        setIncomeReport(startDate, endDate);
      } else {
        setIncomeReport(startNewDate, endNewDate);
      }
    }
  });
  function setIncomeReport(startNewDate, endNewDate) {
    $.ajax({
      type: 'GET',
      url: route('super.admin.income.chart'),
      dataType: 'json',
      data: {
        start_date: startNewDate,
        end_date: endNewDate
      },
      success: function success(result) {
        if (result.success) {
          $('#hospitalIncomeChart').html('');
          $('#hospitalIncomeChart').append('<canvas id="revenueChart" height="200"></canvas>');
          var ctx = document.getElementById('revenueChart').getContext('2d');
          ctx.canvas.style.height = '500px';
          var myChart = new Chart(ctx, {
            type: chartType,
            data: {
              labels: result.data.days,
              datasets: [result.data.income]
            },
            options: {
              plugins: {
                tooltip: {
                  callbacks: {
                    label: function label(context) {
                      var label = context.dataset.label || '';
                      if (label) {
                        label += ': ';
                      }
                      if (context.parsed.y !== null) {
                        label += $('.superAdminCurrentCurrency').val() + new Intl.NumberFormat('en-US', {
                          // style: 'currency',
                          // currency: $('.superAdminCurrentCurrency').val(),
                        }).format(context.parsed.y);
                      }
                      return label;
                    }
                  }
                },
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  stacked: true,
                  ticks: {
                    min: 0,
                    // stepSize: 1000,
                    callback: function callback(value) {
                      return $('.superAdminCurrentCurrency').val() + new Intl.NumberFormat('en-US', {
                        // style: 'currency',
                        // currency: $('.superAdminCurrentCurrency').val(),
                      }).format(value);
                    }
                  }
                }
              },
              responsive: true,
              maintainAspectRatio: true,
              responsiveAnimationDuration: 500,
              legend: {
                display: false
              }
            }
          });
        }
      }
    });
  }
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**********************************************************!*\
  !*** ./resources/assets/js/subscription/subscription.js ***!
  \**********************************************************/
document.addEventListener('turbo:load', loadSubscriptionsDate);
function loadSubscriptionsDate() {
  listenClick('#resetFilter', function () {
    $('#paymentTypeArr, #statusArr, #frequencyArr').val('').trigger('change');
    hideDropdownManually('.dropdown-menu,#dropdownMenuButton1');
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!*********************************************************!*\
  !*** ./resources/assets/js/subscription/create-edit.js ***!
  \*********************************************************/
document.addEventListener('turbo:load', loadSubscriptionCreateData);
function loadSubscriptionCreateData() {
  $('#subscriptionStatus').select2();
  $('#subscriptionEndsAt').flatpickr({
    dateFormat: 'Y-m-d H:i',
    defaultDate: $('#subscriptionEndAt').val(),
    minDate: $('#subscriptionEndAt').val(),
    enableTime: true,
    locale: $('.userCurrentLanguage').val()
  });
  listenSubmit('#editSubscription', function () {
    $('#subscriptionBtnSave').attr('disabled', true);
  });
}
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/currency_settings/create_edit.js ***!
  \**************************************************************/
document.addEventListener('turbo:load', loadCurrencySettingsDate);
function loadCurrencySettingsDate() {}
listenSubmit('#addCurrencyForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: $('#indexCurrencyCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_currency_modal').modal('hide');
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal('#add_currency_modal', function () {
  resetModalForm('#addCurrencyForm');
});
listenClick('.currency-edit-btn', function (event) {
  // console.log('button clicked')
  var currencyId = $(event.currentTarget).attr('data-id');
  renderCurrencyData(currencyId);
});
function renderCurrencyData(id) {
  $.ajax({
    url: $('#indexCurrenciesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      // console.log(result.data)
      if (result.success) {
        var currency = result.data;
        $('#editCurrencyId').val(currency.id);
        $('#editCurrencyName').val(currency.currency_name);
        $('#editCurrencyCode').val(currency.currency_code);
        $('#editCurrencyIcon').val(currency.currency_icon);
        $('#edit_currency_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editCurrencyForm', function (e) {
  e.preventDefault();
  var id = $('#editCurrencyId').val();
  $.ajax({
    url: $('#indexCurrenciesUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_currency_modal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick('.currency-delete-btn', function (event) {
  var currencyId = $(event.currentTarget).attr('data-id');
  deleteItem($('#indexCurrenciesUrl').val() + '/' + currencyId, '', Lang.get('messages.subscription_plans.currency'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************************!*\
  !*** ./resources/assets/js/super_admin_currency_settings/create_edit.js ***!
  \**************************************************************************/
document.addEventListener('turbo:load', loadSuperAdminCurrencySettingsData);
function loadSuperAdminCurrencySettingsData() {}
listenSubmit('#addSuperAdminCurrencyForm', function (e) {
  e.preventDefault();
  $.ajax({
    url: $('#indexAdminCurrencyCreateUrl').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#add_admin_currency_modal').modal('hide');
        Livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenHiddenBsModal('#add_admin_currency_modal', function () {
  resetModalForm('#addSuperAdminCurrencyForm');
});
listenClick('.admin-currency-edit-btn', function (event) {
  // console.log('button clicked')
  var currencyId = $(event.currentTarget).attr('data-id');
  renderAdminCurrencyData(currencyId);
});
function renderAdminCurrencyData(id) {
  $.ajax({
    url: $('#indexAdminCurrenciesUrl').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      // console.log(result.data)
      if (result.success) {
        var currency = result.data;
        $('#editAdminCurrencyId').val(currency.id);
        $('#editAdminCurrencyName').val(currency.currency_name);
        $('#editAdminCurrencyCode').val(currency.currency_code);
        $('#editAdminCurrencyIcon').val(currency.currency_icon);
        $('#edit_admin_currency_modal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
}
listenSubmit('#editAdminCurrencyForm', function (e) {
  e.preventDefault();
  var id = $('#editAdminCurrencyId').val();
  $.ajax({
    url: $('#indexAdminCurrenciesUrl').val() + '/' + id,
    type: 'put',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#edit_admin_currency_modal').modal('hide');
        livewire.emit('refresh');
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick('.admin-currency-delete-btn', function (event) {
  var currencyId = $(event.currentTarget).attr('data-id');
  deleteItem(route('super-admin-currency-settings.destroy', currencyId), '', Lang.get('messages.subscription_plans.currency'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!**************************************************************!*\
  !*** ./resources/assets/js/doctor_holiday/doctor_holiday.js ***!
  \**************************************************************/
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
document.addEventListener('turbo:load', loadDoctorHoliday);
function loadDoctorHoliday() {
  loadHoliday();
  var lang = $('.currentLanguage').val();
  $('#doctorHolidayDate').flatpickr({
    'locale': lang,
    minDate: new Date().fp_incr(1),
    disableMobile: true
  });
  listenClick('.doctor-holiday-delete-btn', function (event) {
    var holidayRecordId = $(event.currentTarget).attr('data-id');
    deleteItem(route('holidays.destroy', holidayRecordId), '', Lang.get('messages.holiday.holiday'));
  });
  if (!$('#doctorHolidayDateFilter').length) {
    return;
  }
  var startDate = moment().startOf('week');
  var endDate = moment().endOf('week');
  function cb(start, end) {
    $('#doctorHolidayDateFilter').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
  }
  $('#doctorHolidayDateFilter').daterangepicker({
    startDate: startDate,
    endDate: endDate,
    opens: 'left',
    showDropdowns: true,
    locale: {
      customRangeLabel: Lang.get('messages.common.custom'),
      applyLabel: Lang.get('messages.common.apply'),
      cancelLabel: Lang.get('messages.common.cancel'),
      fromLabel: Lang.get('messages.common.from'),
      toLabel: Lang.get('messages.common.to'),
      monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
      daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
    },
    ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.appointment.today'), [moment(), moment()]), Lang.get('messages.appointment.yesterday'), [moment().subtract(1, 'days'), moment().subtract(1, 'days')]), Lang.get('messages.appointment.this_week'), [moment().startOf('week'), moment().endOf('week')]), Lang.get('messages.appointment.last_7_days'), [moment().subtract(6, 'days'), moment()]), Lang.get('messages.appointment.last_30_days'), [moment().subtract(29, 'days'), moment()]), Lang.get('messages.appointment.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.appointment.last_month'), [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')])
  }, cb);
  cb(startDate, endDate);
}
listenChange('#doctorHolidayStatus', function () {
  $('#doctorHolidayStatus').val($(this).val());
  window.livewire.emit('changeStatusFilter', $(this).val());
});
function loadHoliday() {
  if (!$('#holidayDateFilter').length) {
    return;
  }
  var Start = moment().startOf('week');
  var End = moment().endOf('week');
  function cb(start, end) {
    $('#holidayDateFilter').val(start.format('YYYY-MM-DD') + ' - ' + end.format('YYYY-MM-DD'));
  }
  $('#holidayDateFilter').daterangepicker({
    startDate: Start,
    endDate: End,
    opens: 'left',
    showDropdowns: true,
    locale: {
      customRangeLabel: Lang.get('messages.common.custom'),
      applyLabel: Lang.get('messages.common.apply'),
      cancelLabel: Lang.get('messages.common.cancel'),
      fromLabel: Lang.get('messages.common.from'),
      toLabel: Lang.get('messages.common.to'),
      monthNames: [Lang.get('messages.months.jan'), Lang.get('messages.months.feb'), Lang.get('messages.months.mar'), Lang.get('messages.months.apr'), Lang.get('messages.months.may'), Lang.get('messages.months.jun'), Lang.get('messages.months.jul'), Lang.get('messages.months.aug'), Lang.get('messages.months.sep'), Lang.get('messages.months.oct'), Lang.get('messages.months.nov'), Lang.get('messages.months.dec')],
      daysOfWeek: [Lang.get('messages.weekdays.sun'), Lang.get('messages.weekdays.mon'), Lang.get('messages.weekdays.tue'), Lang.get('messages.weekdays.wed'), Lang.get('messages.weekdays.thu'), Lang.get('messages.weekdays.fri'), Lang.get('messages.weekdays.sat')]
    },
    ranges: _defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty(_defineProperty({}, Lang.get('messages.datepicker.today'), [moment(), moment()]), Lang.get('messages.datepicker.yesterday'), [moment().subtract(1, 'days'), moment().subtract(1, 'days')]), Lang.get('messages.datepicker.this_week'), [moment().startOf('week'), moment().endOf('week')]), Lang.get('messages.datepicker.last_30_days'), [moment().subtract(29, 'days'), moment()]), Lang.get('messages.datepicker.this_month'), [moment().startOf('month'), moment().endOf('month')]), Lang.get('messages.datepicker.last_month'), [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')])
  }, cb);
  cb(Start, End);
}
listenChange('#holidayDateFilter,#doctorHolidayDateFilter', function () {
  window.livewire.emit('changeDateFilter', $(this).val());
});
listenClick('.holiday-delete-btn', function (event) {
  var holidayRecordId = $(event.currentTarget).attr('data-id');
  deleteItem(route('doctors.holiday-destroy', holidayRecordId), Lang.get('messages.holiday.holiday'));
});
listenClick('#holidayDateResetFilter', function () {
  $('#holidayDateFilter').data('daterangepicker').setStartDate(moment().startOf('week').format('MM/DD/YYYY'));
  $('#holidayDateFilter').data('daterangepicker').setEndDate(moment().endOf('week').format('MM/DD/YYYY'));
  hideDropdownManually($('#holidayFilterBtn'), $('.dropdown-menu'));
});
listenClick('#doctorHolidayResetFilter', function () {
  $('#doctorHolidayDateFilter').data('daterangepicker').setStartDate(moment().startOf('week').format('MM/DD/YYYY'));
  $('#doctorHolidayDateFilter').data('daterangepicker').setEndDate(moment().endOf('week').format('MM/DD/YYYY'));
  hideDropdownManually($('#doctorHolidayFilterBtn'), $('.dropdown-menu'));
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!********************************************************!*\
  !*** ./resources/assets/js/lunch_break/lunch_break.js ***!
  \********************************************************/
document.addEventListener('turbo:load', loadLunchBreakData);
function loadLunchBreakData() {
  var lang = $('.currentLanguage').val();
  $('#doctorLunchBreakDate').flatpickr({
    'locale': lang,
    minDate: new Date(),
    disableMobile: true
  });
  $(".breakFrom").flatpickr({
    enableTime: true,
    noCalendar: true,
    enableSeconds: true,
    dateFormat: "H:i:S",
    minTime: "00:05:00",
    time_24hr: true
  });
  $(".breakTo").flatpickr({
    enableTime: true,
    noCalendar: true,
    enableSeconds: true,
    dateFormat: "H:i:S",
    time_24hr: true,
    minTime: "00:05:00"
  });
}
listenClick('#editOneDay', function () {
  $('.customiseDate').removeClass('d-none');
});
listenClick('#editEveryDay', function () {
  $('.customiseDate').addClass('d-none');
});
listenClick('.doctor-lunch-break-delete-btn', function (event) {
  var lunchBreakRecordId = $(event.currentTarget).attr('data-id');
  deleteItem(route('breaks.destroy', lunchBreakRecordId), '', Lang.get('messages.lunch_break.lunch_break'));
});
listenSubmit(".doctorBreakForm", function (e) {
  e.preventDefault();
  var breakStartTime = $(".breakFrom").val();
  var breakEndTime = $(".breakTo").val();
  if (breakStartTime == "00:00:00") {
    displayErrorMessage(Lang.get('messages.lunch_break.break_time_greater_than_zero'));
    return false;
  }
  if (breakEndTime == "00:00:00") {
    displayErrorMessage(Lang.get('messages.lunch_break.break_to_time_greater_than_zero'));
    return false;
  }
  if (breakEndTime == breakStartTime) {
    displayErrorMessage(Lang.get('messages.lunch_break.break_to_time_greater_than_from_time'));
    return false;
  }
  if ($("#editOneDay").is(":checked") == true) {
    if ($.trim($("#doctorLunchBreakDate").val()) == "") {
      displayErrorMessage(Lang.get('messages.lunch_break.date_required'));
      return false;
    }
  }
  $(this)[0].submit();
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!****************************************************************!*\
  !*** ./resources/assets/js/pathology_units/pathology_units.js ***!
  \****************************************************************/


listenSubmit('#addPathologyUnitForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#pathologyUnitSave');
  loadingButton.button('loading');
  $('#pathologyUnitSave').attr('disabled', true);
  $.ajax({
    url: $('#createPathologyUnitURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addPathologyUnitsModal').modal('hide');
        window.livewire.emit('refresh');
        $('#pathologyUnitSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#pUniValidationErrorsBox', result);
      $('#pathologyUnitSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editPathologyUnitsForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editPathologyUnitSaveBtn');
  loadingButton.button('loading');
  var id = $('#pathologyUnitId').val();
  $('#editPathologyUnitSaveBtn').attr('disabled', true);
  $.ajax({
    url: $('#pathologyUnitURL').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editPathologyUnitsModal').modal('hide');
        window.livewire.emit('refresh');
        $('#editPathologyUnitSaveBtn').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#editPathologyUnitSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addPathologyUnitsModal', function () {
  resetModalForm('#addPathologyUnitForm', '#pUniValidationErrorsBox');
  $('#pathologyUnitSave').attr('disabled', false);
});
listenHiddenBsModal('#editPathologyUnitsModal', function () {
  resetModalForm('#editPathologyUnitsForm', '#editPUniValidationErrorsBox');
  $('#editPathologyUnitSaveBtn').attr('disabled', false);
});
window.renderPathologyUnitData = function (id) {
  $.ajax({
    url: $('#pathologyUnitURL').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var pathologyCategory = result.data;
        $('#pathologyUnitId').val(pathologyCategory.id);
        $('#editPathologyUnitName').val(pathologyCategory.name);
        $('#editPathologyUnitsModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenClick('.edit-pathology-unit-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var pathologyUnitId = $(event.currentTarget).attr('data-id');
  renderPathologyUnitData(pathologyUnitId);
});
listenClick('.delete-pathology-unit-btn', function (event) {
  var pathologyUnitId = $(event.currentTarget).attr('data-id');
  deleteItem($('#pathologyUnitURL').val() + '/' + pathologyUnitId, '#pathologyUnitTable', $('#pathologyUnitLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!**************************************************************************!*\
  !*** ./resources/assets/js/pathology_parameters/pathology_parameters.js ***!
  \**************************************************************************/


document.addEventListener('turbo:load', loadPathologyParameterData);
function loadPathologyParameterData() {
  $('#pathologyParameterUnitId,.edit-unit').select2({
    width: '100%'
  });
}
listenSubmit('#addPathologyParameterForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#pathologyParameterSave');
  loadingButton.button('loading');
  $('#pathologyParameterSave').attr('disabled', true);
  $.ajax({
    url: $('#createPathologyParameterURL').val(),
    type: 'POST',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#addPathologyParametersModal').modal('hide');
        window.livewire.emit('refresh');
        $('#pathologyParameterSave').attr('disabled', false);
      }
    },
    error: function error(result) {
      printErrorMessage('#parameterValidationErrorsBox', result);
      $('#pathologyParameterSave').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenSubmit('#editPathologyParameterForm', function (event) {
  event.preventDefault();
  var loadingButton = jQuery(this).find('#editPathologyParameterSaveBtn');
  loadingButton.button('loading');
  var id = $('#pathologyParameterId').val();
  $('#editPathologyCategorySaveBtn').attr('disabled', true);
  $.ajax({
    url: $('#pathologyParameterURL').val() + '/' + id,
    type: 'patch',
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $('#editPathologyParametersModal').modal('hide');
        window.livewire.emit('refresh');
        $('#editPathologyParameterSaveBtn').attr('disabled', false);
      }
    },
    error: function error(result) {
      UnprocessableInputError(result);
      $('#editPathologyParameterSaveBtn').attr('disabled', false);
    },
    complete: function complete() {
      loadingButton.button('reset');
    }
  });
});
listenHiddenBsModal('#addPathologyParametersModal', function () {
  resetModalForm('#addPathologyParameterForm', '#parameterValidationErrorsBox');
  $('#pathologyParameterSave').attr('disabled', false);
});
listenHiddenBsModal('#editPathologyParametersModal', function () {
  resetModalForm('#editPathologyParameterForm', '#editParameterValidationErrorsBox');
  $('#editPathologyParameterSaveBtn').attr('disabled', false);
});
window.renderPathologyParameterData = function (id) {
  $.ajax({
    url: $('#pathologyParameterURL').val() + '/' + id + '/edit',
    type: 'GET',
    success: function success(result) {
      if (result.success) {
        var pathologyParameter = result.data;
        $('#pathologyParameterId').val(pathologyParameter.id);
        $('#editPathologyParameterName').val(pathologyParameter.parameter_name);
        $('#editParameterRange').val(pathologyParameter.reference_range);
        $('#editPathologyUnitId').val(pathologyParameter.unit_id).trigger('change');
        $('#editParameterDescription').val(pathologyParameter.description);
        $('#editPathologyParametersModal').modal('show');
        ajaxCallCompleted();
      }
    },
    error: function error(result) {
      manageAjaxErrors(result);
    }
  });
};
listenClick('.edit-pathology-parameter-btn', function (event) {
  if ($('.ajaxCallIsRunning').val()) {
    return;
  }
  ajaxCallInProgress();
  var pathologyParameterId = $(event.currentTarget).attr('data-id');
  renderPathologyParameterData(pathologyParameterId);
});
listenClick('.delete-pathology-parameter-btn', function (event) {
  var pathologyParameterId = $(event.currentTarget).attr('data-id');
  deleteItem($('#pathologyParameterURL').val() + '/' + pathologyParameterId, '#pathologyParameterTable', $('#pathologyParameterLang').val());
});
})();

// This entry need to be wrapped in an IIFE because it need to be isolated against other entry modules.
(() => {
/*!************************************************************************!*\
  !*** ./resources/assets/js/smart_patient_cards/smart_patient_cards.js ***!
  \************************************************************************/
document.addEventListener("turbo:load", smartPatientCardDataLoad);
function smartPatientCardDataLoad() {
  $("#cardTemplateID,.patient-id").select2({
    width: "100%",
    dropdownParent: $("#addPatientCardModal")
  });
  if (!$(".header-color-wrapper").length) {
    return false;
  }
  var primaryColorPickr = Pickr.create({
    el: ".header-color-wrapper",
    theme: "nano",
    // or 'monolith', or 'nano'
    closeWithKey: "Enter",
    autoReposition: true,
    defaultRepresentation: "HEX",
    position: "bottom-start",
    swatches: ["rgba(244, 67, 54, 1)", "rgba(233, 30, 99, 1)", "rgba(156, 39, 176, 1)", "rgba(103, 58, 183, 1)", "rgba(63, 81, 181, 1)", "rgba(33, 150, 243, 1)", "rgba(3, 169, 244, 1)", "rgba(0, 188, 212, 1)", "rgba(0, 150, 136, 1)", "rgba(76, 175, 80, 1)", "rgba(139, 195, 74, 1)", "rgba(205, 220, 57, 1)", "rgba(255, 235, 59, 1)", "rgba(255, 193, 7, 1)"],
    components: {
      // Main components
      preview: true,
      hue: true,
      // Input / output Options
      interaction: {
        input: true,
        clear: false,
        save: false
      }
    }
  });
  $("#headerColorId").val(primaryColorPickr.getColor().toHEXA().toString());
  primaryColorPickr.on("change", function () {
    var headerColor = primaryColorPickr.getColor().toHEXA().toString();
    $(".custom-card-header").css("background-color", headerColor);
    if (!$("#editHeaderColorId").length) {
      primaryColorPickr.setColor(headerColor);
      $("#headerColorId").val(headerColor);
    } else {
      primaryColorPickr.setColor(headerColor);
      $("#editHeaderColorId").val(headerColor);
    }
  });
  primaryColorPickr.on("init", function () {
    primaryColorPickr.setColor($("#editHeaderColorId").val());
  });
  // }

  // Patient email
  $("#showEmail").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientEmail").addClass("d-none");
    } else {
      $("#patientEmail").removeClass("d-none");
    }
  });
  // Patient phone
  $("#showPhone").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientNumber").addClass("d-none");
    } else {
      $("#patientNumber").removeClass("d-none");
    }
  });
  // Patient dob
  $("#showDob").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientDob").addClass("d-none");
    } else {
      $("#patientDob").removeClass("d-none");
    }
  });
  // Patient blood group
  $("#showBloodGroup").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientBloodGroup").addClass("d-none");
    } else {
      $("#patientBloodGroup").removeClass("d-none");
    }
  });
  // Patient address
  $("#showAddress").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientAddress").addClass("d-none");
    } else {
      $("#patientAddress").removeClass("d-none");
    }
  });
  // Patient unique ID
  $("#showUniqueID").on("change", function () {
    if ($(this).prop("checked") == false) {
      $("#patientUniqueID").addClass("d-none");
    } else {
      $("#patientUniqueID").removeClass("d-none");
    }
  });
}
listenChange("#show_email, #show_phone, #show_address, #show_blood_group, #show_dob, #show_patient_unique_id", function () {
  var status = $(this).prop("checked") ? 1 : 0;
  var id = $(this).attr("data-id");
  var name = $(this).attr("name");
  $.ajax({
    url: route("patient-smart-card-templates.status", id),
    type: "post",
    data: {
      status: status,
      name: name
    },
    success: function success(data) {
      if (data.success) {
        displaySuccessMessage(data.message);
        livewire.emit("refresh");
      }
    }
  });
});
listenChange("#color", function () {
  var id = $(this).attr("data-id");
  var color = $(this).val();
  $.ajax({
    type: "post",
    url: route("patient-smart-card-templates.status", id),
    data: {
      color: color
    },
    success: function success(data) {
      if (data.success) {
        displaySuccessMessage(data.message);
        livewire.emit("refresh");
      }
    }
  });
});
listenClick(".delete-smart-card-template", function (event) {
  var smartCardId = $(event.currentTarget).attr("data-id");
  deleteItem(route("patient-smart-card-templates.destroy", smartCardId), "", Lang.get("messages.lunch_break.card_template"));
});
listenClick(".delete-smart-patient-card-btn", function (event) {
  var patientCardId = $(event.currentTarget).attr("data-id");
  deleteItem(route("smart-patient-cards.destroy", patientCardId), "", Lang.get("messages.lunch_break.smart_patient_card"));
});
listenClick("#onePatient", function (event) {
  $(".customisePatient").removeClass("d-none");
  $.ajax({
    url: route("get.patients"),
    type: "GET",
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        $("#cardTemplatePatientID").find("option").remove();
        $("#cardTemplatePatientID").append($("<option></option>").attr("placeholder", "").text(Lang.get("messages.document.select_patient")));
        $.each(result.data, function (i, v) {
          $("#cardTemplatePatientID").append($("<option></option>").attr("value", i).text(v));
        });
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
});
listenClick("#allPatient,#remainingPatient", function () {
  $(".customisePatient").addClass("d-none");
});
listenHiddenBsModal("#addPatientCardModal", function () {
  resetModalForm("#addPatientCardForm", "#patientCardErrorsBox");
  $(".template-name").trigger("change");
  $(".patient-id").trigger("change");
  $(".customisePatient").addClass("d-none");
  $("#patientCardSave").attr("disabled", false);
});
listenSubmit("#addPatientCardForm", function (event) {
  event.preventDefault();
  if ($.trim($(".template-name").val()) == "") {
    displayErrorMessage(Lang.get("messages.lunch_break.template_required"));
    return false;
  }
  if ($(".one-patient").is(":checked") == true && $.trim($(".patient-id").val()) == "") {
    displayErrorMessage(Lang.get("messages.lunch_break.patient_required"));
    return false;
  }
  var loadingButton = jQuery(this).find("#patientCardSave");
  loadingButton.button("loading");
  $("#patientCardSave").attr("disabled", true);
  $.ajax({
    url: route("smart-patient-cards.store"),
    type: "POST",
    data: $(this).serialize(),
    success: function success(result) {
      if (result.success) {
        displaySuccessMessage(result.message);
        $("#addPatientCardModal").modal("hide");
        window.livewire.emit("refresh");
        $("#patientCardSave").attr("disabled", false);
      }
    },
    error: function error(result) {
      printErrorMessage("#patientCardErrorsBox", result);
      $("#patientCardSave").attr("disabled", false);
    },
    complete: function complete() {
      loadingButton.button("reset");
    }
  });
});
listenClick(".show-patient-smart-card", function (event) {
  event.preventDefault();
  var patientId = $(event.currentTarget).attr("data-id");
  $('#patientCardAddress,#patientCardBloodGroup,#patientCardDob,#uniqueCardID,#patientCardEmail,patientCardMob').text("");
  $('.patientAddress,.patientBloodGroup,.patientDob,.patient-code,.patientEmail,.patientNumber').addClass('d-none');
  $.ajax({
    url: route("smart-patient-cards.show", patientId),
    type: "GET",
    success: function success(result) {
      if (result.success) {
        var patientAddress = result.data.address;
        $("#patientCardBloodGroup").text();
        $(".profile-img").attr("src", result.data.profile);
        $(".patient-card-header").css("background-color", result.data.smart_card_template.header_color);
        $("#patientCardName").text(result.data.patient_user.full_name);
        if (result.data.smart_card_template.show_address == true && !isEmpty(patientAddress)) {
          $(".patientAddress").removeClass("d-none");
          $("#patientCardAddress").text(patientAddress.address1);
        }
        if (result.data.smart_card_template.show_blood_group == true && !isEmpty(result.data.patient_user.blood_group)) {
          $(".patientBloodGroup").removeClass("d-none");
          $("#patientCardBloodGroup").text(result.data.patient_user.blood_group);
        }
        if (result.data.smart_card_template.show_dob == true && !isEmpty(result.data.patient_user.dob)) {
          $(".patientDob").removeClass("d-none");
          $("#patientCardDob").text(result.data.patient_user.dob);
        }
        if (result.data.smart_card_template.show_patient_unique_id == true) {
          $(".patient-code").removeClass("d-none");
          $("#uniqueCardID").text(result.data.patient_unique_id);
        }
        if (result.data.smart_card_template.show_email == true) {
          $(".patientEmail").removeClass("d-none");
          $("#patientCardEmail").text(result.data.patient_user.email);
        }
        if (result.data.smart_card_template.show_phone == true && !isEmpty(result.data.patient_user.phone)) {
          $(".patientNumber").removeClass("d-none");
          $("#patientCardMob").text(result.data.patient_user.phone);
        }
        $("#showSmartCardModal").modal("show");
      }
    },
    error: function error(result) {
      displayErrorMessage(result.responseJSON.message);
    }
  });
  $.ajax({
    url: route("smart.card.qr.code", patientId),
    type: "GET",
    success: function success(data) {
      $(".qr-code").html(data);
    },
    error: function error(data) {
      displayErrorMessage(Lang.get("messages.lunch_break.qr_code_not_found"));
    }
  });
});
})();

/******/ })()
;