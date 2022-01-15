import React, { useEffect, useMemo, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import classNames from 'classnames';

const useStyles = makeStyles((theme) => ({
    dropzoneContainer: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 2,
        borderRadius: 2,
        borderColor: '#eeeeee',
        borderStyle: 'dashed',
        backgroundColor: '#fafafa',
        color: '#bdbdbd',
        outline: 'none',
        transition: 'border .24s ease-in-out',
    },
    focused: {
        borderColor: theme.palette.primary.main,
    },
    accept: {
        borderColor: theme.palette.secondary.main,
    },
    reject: {
        borderColor: theme.palette.error.main,
    },
    error: {
        color: theme.palette.error.main,
    },
    thumbsContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    thumb: {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #eaeaea',
        marginBottom: 8,
        marginRight: 8,
        width: 100,
        height: 100,
        padding: 4,
        boxSizing: 'border-box',
    },
    thumbInner: {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden',
    },
    img: {
        display: 'block',
        width: 'auto',
        height: '100%',
    },
}));

const fileErrorCodes = {
    FILE_TOO_LARGE: 'file-too-large',
};

const Dropzone = ({
                      accept = 'image/*',
                      maxFiles = 1,
                      maxSize = 5_000_000,
                      name,
                      setFieldValue,
                      onBlur,
                      helperText,
                      error,
                      value,
                  }) => {
    const classes = useStyles();
    const [files, setFiles] = useState([]);
    const [isRejected, setIsRejected] = useState(false);
    const [isAccepted, setIsAccepted] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);

    const getErrorMessage = (errorCodes, code) =>
        errorCodes.findIndex(errorCode => errorCode === code) !== -1 ?
            `No puede cargarse la imagen, verifique su tamaño (el máximo permitido es de ${ maxSize / 1_000_000 } MB)`
            : 'Ocurrio un error';

    const {
        getRootProps,
        getInputProps,
        isFocused,
        isDragAccept,
        isDragReject,
    } = useDropzone({
        accept,
        maxFiles,
        maxSize,
        onDrop: (acceptedFiles, fileRejections) => {
            setIsRejected(fileRejections.length > 0);
            setIsAccepted(acceptedFiles.length > 0);
            const fileErrors = fileRejections.map(fileRejected => fileRejected.errors.map(fileErrorCode => fileErrorCode.code));
            if (fileErrors.length > 0) {
                fileErrors.forEach(errorCodes => {
                    setErrorMessages([
                        getErrorMessage(errorCodes, fileErrorCodes.FILE_TOO_LARGE),
                    ]);
                });
            } else {
                setErrorMessages([]);
            }

            setFieldValue(name, acceptedFiles);

            setFiles(
                acceptedFiles.map(
                    file => Object.assign(file, { preview: URL.createObjectURL(file) }),
                ),
            );
        },
    });

    const dropzoneClassName = useMemo(() =>
            classNames(
                classes.dropzoneContainer,
                {
                    [classes.focused]: isFocused,
                    [classes.accept]: isAccepted || isDragAccept,
                    [classes.reject]: isRejected || isDragReject || error,
                },
            ),
        [
            isFocused,
            isAccepted,
            isDragAccept,
            isRejected,
            isDragReject,
            error,
        ]);

    useEffect(() => {
        if (!value) {
            setErrorMessages([]);
            setFiles([]);
            setIsAccepted(false);
            setIsRejected(false);
        } else {
            setFiles([{
                    name: new Date().getTime(),
                    preview: value,
                }],
            );
        }
    }, [value]);


    const thumbs = files.map(file => (
        <div className={ classes.thumb } key={ file.name }>
            <div className={ classes.thumbInner }>
                <img
                    src={ file.preview }
                    className={ classes.img }
                    alt='preview' />
            </div>
        </div>
    ));

    return (
        <section className='container'>
            <div { ...getRootProps({ className: dropzoneClassName }) }>
                <input { ...getInputProps() } onBlur={ onBlur } />
                { files.length === 0 ?
                    <p>Arrastre el archivo aquí, o haga click para seleccionar el archivo</p>
                    : files.map((file, index) =>
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={ index }>
                            <p>{ file.name }</p>
                        </div>,
                    )
                }
            </div>
            <aside className={ classes.thumbsContainer } style={ { marginTop: files?.length > 0 ? 16 : 0 } }>
                { error && <p className={ classes.error }>{ helperText }</p> }
                { (isRejected || isDragReject) && errorMessages.map((message, index) => (
                    // eslint-disable-next-line react/no-array-index-key
                    <p key={ index }>{ message }</p>))
                }
                { !isRejected && !error && !isDragReject && thumbs }
            </aside>
        </section>
    );
};

Dropzone.defaultProps = {
    accept: 'image/*',
    maxFiles: 1,
    maxSize: 5_000_000,
    error: false,
    onBlur: () => null,
    helperText: ' ',
};

Dropzone.propTypes = {
    name: PropTypes.string.isRequired,
    setFieldValue: PropTypes.func.isRequired,
    onBlur: PropTypes.func,
    accept: PropTypes.string,
    maxFiles: PropTypes.number,
    maxSize: PropTypes.number,
    helperText: PropTypes.string,
    error: PropTypes.bool,
    value: PropTypes.string.isRequired,
};

export default Dropzone;
