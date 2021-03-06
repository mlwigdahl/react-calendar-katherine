// TODO -- need to make sure the saga exceptions are properly cracked into strings...

import { put, call, apply, takeEvery } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import initialState from './initialState';
import CalendarApi from '../api/mockCalendarApi';
import * as async from './asyncDuck';
import { sagas as dateSagas } from './dateDuck';

// actions

export const actions = {
    LOAD_CALENDAR_SUCCESS: 'react-visual-calendar/calendar/LOAD_CALENDAR_SUCCESS',
    LOAD_CALENDAR_FAILURE: 'react-visual-calendar/calendar/LOAD_CALENDAR_FAILURE',
    LOAD_CALENDAR_REQUEST: 'react-visual-calendar/calendar/LOAD_CALENDAR_REQUEST',

    LOAD_DATEICON_SUCCESS: 'react-visual-calendar/calendar/LOAD_DATEICON_SUCCESS',
    LOAD_DATEICON_FAILURE: 'react-visual-calendar/calendar/LOAD_DATEICON_FAILURE',
    LOAD_DATEICON_REQUEST: 'react-visual-calendar/calendar/LOAD_DATEICON_REQUEST',

    UPDATE_DATEICON_SUCCESS: 'react-visual-calendar/calendar/UPDATE_DATEICON_SUCCESS',
    UPDATE_DATEICON_FAILURE: 'react-visual-calendar/calendar/UPDATE_DATEICON_FAILURE',
    UPDATE_DATEICON_REQUEST: 'react-visual-calendar/calendar/UPDATE_DATEICON_REQUEST',

    PUSH_DATES: 'react-visual-calendar/calendar/PUSH_DATES',
};

// reducer

export function reducer(state = initialState.calendar, action) {
    switch (action.type) {
        case actions.LOAD_CALENDAR_SUCCESS:
            return { ...action.data.calendar };

        case actions.LOAD_CALENDAR_FAILURE:
            return state; // TODO more here?  Probably update global message...

        case actions.LOAD_DATEICON_SUCCESS:
/*            return { 
                ...state,
                date: [
                    ...(state.date).filter(date => date.id !== action.date_id),
                    {
                        ...(state.date).filter(date => date.id === action.date_id),
                        icon: {...action.icon}
                    }
                ]
            }; */ // TODO this is wrong
            return state;

        case actions.LOAD_DATEICON_FAILURE:
            return state; // TODO more here?  Probably update global message...

        case actions.UPDATE_DATEICON_SUCCESS:
/*            return { 
                ...state,
                date: [
                    ...(state.date).filter(date => date.id !== action.date_id),
                    {
                        ...(state.date).filter(date => date.id === action.date_id),
                        icon: {...action.icon}
                    }
                ]
            }; */ // TODO this is wrong
            return state;

        case actions.UPDATE_DATEICON_FAILURE:
            return state; // TODO more here?  Probably update global message...

        case actions.PUSH_DATES:
        {
            const pushMax = state.maxDate >= action.data.maxDate ? false : true;
            const pushMin = state.minDate <= action.data.minDate ? false : true;

            if (!pushMax && !pushMin) {
                return state;
            }
            else if (pushMax && pushMin) {
                return { ...state, minDate: action.data.minDate, maxDate: action.data.maxDate };
            }
            else if (pushMax) {
                return { ...state, maxDate: action.data.maxDate };
            }
            else {
                return { ...state, minDate: action.data.minDate };
            }
        }

        default:
            return state;
    }
}

// sagas

export const sagas = {
    watchers: {
        LOAD_CALENDAR_REQUEST: function* () {
            yield takeEvery(actions.LOAD_CALENDAR_REQUEST, sagas.workers.loadCalendar);
        },
        LOAD_DATEICON_REQUEST: function* () {
            yield takeEvery(actions.LOAD_DATEICON_REQUEST, sagas.workers.loadDateIcon);
        },
        UPDATE_DATEICON_REQUEST: function* () {
            yield takeEvery(actions.UPDATE_DATEICON_REQUEST, sagas.workers.updateDateIcon);
        },
    },
    workers: {
        loadCalendar: function* (action) {
            try {
                yield put(async.creators.asyncRequest());
                const calendar = yield call(CalendarApi.loadCalendar, action.data.userId);
                yield put(creators.loadCalendarSuccess(calendar));
                
                yield* dateSagas.helpers.loadDateRange(calendar.minDate, calendar.maxDate, action.data.userId);

                yield apply(browserHistory, browserHistory.push, [`/`]);
            }
            catch (e) {
                yield put(async.creators.asyncError(e));
            }
        },
        loadDateIcon: function* (action) {
            try {
                yield put(async.creators.asyncRequest());
                const icon = yield call(CalendarApi.loadDateIcon, action.data.dateId, action.data.userId);
                yield put(creators.loadDateIconSuccess(icon, action.data.dateId));
            }
            catch (e) {
                yield put(async.creators.asyncError(e));
            }
        },
        updateDateIcon: function* (action) {
            try {
                yield put(async.creators.asyncRequest());
                const iconRet = yield call(CalendarApi.updateDateIcon, action.data.icon, action.data.dateId, action.data.userId);
                yield put(creators.updateDateIconSuccess(iconRet, action.data.dateId));
            }
            catch (e) {
                yield put(async.creators.asyncError(e));
            }
        },
    }
};

// action creators

export const creators = {

    loadCalendarSuccess: (calendar) => {
        return { type: actions.LOAD_CALENDAR_SUCCESS, data: { calendar } };
    },

    loadCalendarFailure: (error) => {
        return { type: actions.LOAD_CALENDAR_FAILURE, data: { error } };
    },

    loadCalendarRequest: (userId) => {
        return { type: actions.LOAD_CALENDAR_REQUEST, data: { userId } };
    },

    loadDateIconSuccess: (icon, dateId) => {
        return { type: actions.LOAD_DATEICON_SUCCESS, data: { icon, dateId } };
    },

    loadDateIconFailure: (error) => {
        return { type: actions.LOAD_DATEICON_FAILURE, data: { error } };
    },

    loadDateIconRequest: (dateId, userId) => {
        return { type: actions.LOAD_DATEICON_REQUEST, data: { dateId, userId } };
    },

    updateDateIconSuccess: (icon, dateId) => {
        return { type: actions.UPDATE_DATEICON_SUCCESS, data: { icon, dateId } };
    },

    updateDateIconFailure: (error) => {
        return { type: actions.UPDATE_DATEICON_FAILURE, data: { error } };
    },

    updateDateIconRequest: (icon, dateId, userId) => {
        return { type: actions.UPDATE_DATEICON_REQUEST, data: { icon, dateId, userId } };
    },

    pushDates: (minDate, maxDate) => {
        return { type: actions.PUSH_DATES, data: { minDate, maxDate } };
    },
};

export const selectors = {
    getRange: state => {
        return { minDate: state.calendar.minDate, maxDate: state.calendar.maxDate };
    }
};