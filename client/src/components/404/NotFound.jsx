import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-navy-50 px-6 text-center">
      <p className="font-display text-8xl leading-none tracking-wide text-brand-600">
        404
      </p>
      <h1 className="text-3xl font-bold text-navy-900">Page not found</h1>
      <p className="max-w-md text-navy-500">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Let&apos;s get you back in the ring.
      </p>
      <div className="mt-2 flex gap-3">
        <Link to="/" className="btn-primary">
          Go Home
        </Link>
        <Link to="/contact" className="btn-secondary">
          Contact Support
        </Link>
      </div>
    </div>
  );
}
