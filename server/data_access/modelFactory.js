"use strict";

import {TimelineItemSchema, UserSchema, EventVoteSchema, LoginsSchema}         from "./schemas";
import connectionProvider                                        from "./connectionProvider";
import {serverSettings}                                          from "../settings";

export const getUserModel = async function () {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("User", UserSchema);
    } catch (err) {
        throw err;
    }
};

export const getTimelineItemModel = async function () {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("TimelineItem", TimelineItemSchema);
    } catch (err) {
        throw err;
    }
};

export const getEventVoteModel = async function() {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("EventVote", EventVoteSchema);
    } catch(err) {
        throw err;
    }
};

export const getLoginsModel = async function() {
    try {
        const conn = await connectionProvider(serverSettings.serverUrl, serverSettings.database);
        return conn.model("Logins", LoginsSchema);
    }catch(err) {
        throw err;
    }
}