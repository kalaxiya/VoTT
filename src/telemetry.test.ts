import { setUpAppInsights, trackError, trackReduxAction } from "./telemetry";
import { ApplicationInsights } from "@microsoft/applicationinsights-web";
import { Action } from "redux";
import { ErrorCode } from "./models/applicationState";

jest.mock("./common/hostProcess");
import { isElectron } from "./common/hostProcess";

jest.mock("@microsoft/applicationinsights-web");

describe("appInsights telemetry", () => {
    const isElectronMock = isElectron as jest.Mock;
    isElectronMock.mockImplementation(() => false);

    describe("electron mode", () => {
        beforeEach(() => {
            isElectronMock.mockImplementation(() => true);
        });

        it("setUpAppInsights should do nothing", () => {
            const spy = jest.spyOn(ApplicationInsights.prototype, "loadAppInsights");
            setUpAppInsights();
            expect(spy).not.toBeCalled();
        });

        it("trackError does not call trackException", () => {
            const spy = jest.spyOn(ApplicationInsights.prototype, "trackException");
            setUpAppInsights();
            trackError(ErrorCode.Unknown, "test message");

            expect(spy).not.toBeCalled();
        });

        it("trackReduxAction does not call trackEvent", () => {
            const spy = jest.spyOn(ApplicationInsights.prototype, "trackEvent");
            setUpAppInsights();
            const action: Action = {type: "test"};
            trackReduxAction(action);

            expect(spy).not.toBeCalled();
        });
    });

    it("setUpAppInsights load an appInsights object", () => {
        const spy = jest.spyOn(ApplicationInsights.prototype, "loadAppInsights");
        setUpAppInsights();
        expect(spy).toHaveBeenCalled();
    });

    it("trackReduxAction call trackEvent", () => {
        const spy = jest.spyOn(ApplicationInsights.prototype, "trackEvent");
        setUpAppInsights();
        const action: Action = {type: "test"};
        trackReduxAction(action);

        expect(spy).toBeCalled();
    });

    it("trackError call trackException", () => {
        const spy = jest.spyOn(ApplicationInsights.prototype, "trackException");
        setUpAppInsights();
        trackError(ErrorCode.Unknown, "test message");

        expect(spy).toBeCalled();
    });
});