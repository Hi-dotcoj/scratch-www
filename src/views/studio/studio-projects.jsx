import React, {useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useParams} from 'react-router-dom';
import {connect} from 'react-redux';

import {projectFetcher} from './lib/fetchers';
import {projects} from './lib/redux-modules';
import Debug from './debug.jsx';

const {actions, selector: projectsSelector} = projects;
import {selectCanAddProjects} from '../../redux/studio';

const StudioProjects = ({
    canAddProjects, items, error, loading, moreToLoad, onLoadMore
}) => {
    const {studioId} = useParams();

    useEffect(() => {
        if (studioId && items.length === 0) onLoadMore(studioId, 0);
    }, [studioId]);

    const handleLoadMore = useCallback(() => onLoadMore(studioId, items.length), [studioId, items.length]);

    return (
        <div>
            <h2>Projects</h2>
            {error && <Debug
                label="Error"
                data={error}
            />}
            <Debug
                label="Project Permissions"
                data={{canAddProjects}}
            />
            <div>
                {items.map((item, index) =>
                    (<Debug
                        label="Project"
                        data={item}
                        key={index}
                    />)
                )}
                {loading ? <small>Loading...</small> : (
                    moreToLoad ?
                        <button onClick={handleLoadMore}>
                            Load more
                        </button> :
                        <small>No more to load</small>
                )}
            </div>
        </div>
    );
};

StudioProjects.propTypes = {
    canAddProjects: PropTypes.bool,
    items: PropTypes.array, // eslint-disable-line react/forbid-prop-types
    loading: PropTypes.bool,
    error: PropTypes.object, // eslint-disable-line react/forbid-prop-types
    moreToLoad: PropTypes.bool,
    onLoadMore: PropTypes.func
};

const mapStateToProps = state => ({
    ...projectsSelector(state),
    canAddProjects: selectCanAddProjects(state)
});

const mapDispatchToProps = dispatch => ({
    onLoadMore: (studioId, offset) => dispatch(
        actions.loadMore(projectFetcher.bind(null, studioId, offset))
    )
});
export default connect(mapStateToProps, mapDispatchToProps)(StudioProjects);
