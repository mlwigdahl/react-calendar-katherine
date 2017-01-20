import React, {PropTypes} from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
// import { bindActionCreators } from 'redux';

export class DayPage extends React.Component {
    constructor(props, context) {
        super(props, context);
        
        this.redirectToMainPage = this.redirectToMainPage.bind(this);
    }

    redirectToMainPage() {
        browserHistory.push('/');
    }

    renderEvents(dates) {
        return dates.map(date => date.events.map(
            (event, index) => {
                return (<div key={index}>
                    <span className="date-label">{`${event.label}`}</span>
                    <br/>
                    <span className="date-start">{`${event.startTime}`}</span>
                    <br/>
                    <span className="date-end">{`${event.endTime}`}</span>
                </div>);
            }
        ));
    }

    render() {
        return (
            <div>
                <h1>Day</h1>
                <div>{this.renderEvents(this.props.dates)}</div>
                <input type="submit"
                    value="Go To Main"
                    className="btn btn-primary"
                    onClick={this.redirectToMainPage}/>
            </div>
        );
    }
}

DayPage.propTypes = {
    id: PropTypes.string.isRequired,
    dates: PropTypes.array.isRequired,
};

function mapStateToProps(state, ownProps) {
    const id = ownProps.params.id; // from the path '/course/:id'
    const dates = state.calendars
        .find(cal => cal.id == state.app.activeCalId)
        .dateInfo.filter(info => info.date == id) || [];

    return {
        id,
        dates,
    };
}

function mapDispatchToProps(/*dispatch*/) {
    return {
//        actions: bindActionCreators(authorActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DayPage);