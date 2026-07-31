import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} Makanak. All rights reserved.
        </p>
        <nav className="flex flex-wrap gap-6 text-sm" aria-label="Footer">
          <Link to="/#pricing" className="text-muted hover:text-foreground">
            Sign up
          </Link>
          <Link to="/login" className="text-muted hover:text-foreground">
            Log in
          </Link>
          <a
            href="mailto:hello@makanak.app"
            className="text-muted hover:text-foreground"
          >
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
