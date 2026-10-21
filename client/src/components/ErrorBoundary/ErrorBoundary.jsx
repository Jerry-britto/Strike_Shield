import { Component } from "react";

/**
 * Catches render-time errors anywhere in the tree so a single broken component
 * doesn't blank the whole app. Falls back to a friendly recovery screen.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // In a real app this would report to an error-tracking service.
    console.error("Unhandled UI error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (typeof this.props.onReset === "function") this.props.onReset();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-50 px-6 text-center">
          <h1 className="text-3xl font-bold text-navy-900">
            Something went wrong
          </h1>
          <p className="max-w-md text-navy-600">
            An unexpected error occurred while rendering this page. You can try
            reloading, or head back to the homepage.
          </p>
          {this.state.error?.message && (
            <code className="max-w-full overflow-x-auto rounded-lg bg-navy-100 px-3 py-2 text-left text-sm text-navy-700">
              {String(this.state.error.message)}
            </code>
          )}
          <div className="mt-2 flex gap-3">
            <button onClick={this.handleReset} className="btn-primary">
              Try again
            </button>
            <a href="/" className="btn-secondary">
              Go home
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
