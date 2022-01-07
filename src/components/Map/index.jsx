import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import PropTypes from 'prop-types';
import ContentLoader from 'react-content-loader';

const containerStyle = {
    minHeight: 300,
    minWidth: '100%',
};

const options = {
    disableDefaultUI: true,
    zoomControl: true,
};

const Map = ({
                 zoom,
                 position,
             }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.NEXT_GOOGLE_MAPS_API_KEY,
    });

    return (
        isLoaded ? <GoogleMap mapContainerStyle={ containerStyle }
                              center={ position }
                              options={ options }
                              zoom={ zoom }
        >
            <Marker position={ position } />
        </GoogleMap> : <ContentLoader
            speed={ 2 }
            width={ 300 }
            height={ 300 }
            viewBox='0 0 515 318'
            backgroundColor='#f9f9f9'
            foregroundColor='#ecebeb'
            className='w-full'
        >
            <rect x='0' y='0' rx='6' ry='6' width='100%' height='300' />
        </ContentLoader>
    );
};

Map.defaultProps = {
    zoom: 16,
    position: { lat: 0, lng: 0 },
};

Map.propTypes = {
    zoom: PropTypes.number,
    position: PropTypes.shape({
        lat: PropTypes.number,
        lng: PropTypes.number,
    }),
};

export default Map;
