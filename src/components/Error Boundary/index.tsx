import React, { ErrorInfo } from 'react';

type Props = {
    children: React.ReactElement
};
type State = { 
    hasError: boolean,
    error: string,
    errorMsg: string
};
class ErrorBoundary extends React.Component<Props,State> {
    state = {
        hasError: false,
        error: '',
        errorMsg: '',
    };
    public static getDerivedStateFromError(_:Error):State {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: "",errorMsg: "" };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // You can also log the error to an error reporting service
        this.setState({ ...this.state, hasError: true, error: error.message, errorMsg: errorInfo.componentStack });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <React.Fragment>
                <h1>404</h1>
                <div className="cloak__wrapper">
                <div className="cloak__container">
                    <div className="cloak"></div>
                </div>
                </div>
                <div className="info">
                <h2>We can't find that page</h2>
                <p>We're fairly sure that page used to be here, but seems to have gone missing. We do apologise on it's behalf.</p><a href="https://jhey.dev" target="_blank" rel="noreferrer noopener">Home</a>
                </div>
            </React.Fragment>
        }

        return this.props.children;
    }
}

export default ErrorBoundary