import { Link } from "react-router-dom";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";

const shopLinks = [
  { label: "Home", to: "/" },
  { label: "Boxing Gloves", to: "/" },
  { label: "Protective Gear", to: "/" },
  { label: "New Arrivals", to: "/" },
];

const companyLinks = [
  { label: "About Us", to: "/about" },
  { label: "Contact", to: "/contact" },
  { label: "Careers", to: "/about" },
  { label: "Support", to: "/contact" },
];

const supportLinks = [
  { label: "My Account", to: "/paymenthistory" },
  { label: "Order Tracking", to: "/paymenthistory" },
  { label: "Shipping & Returns", to: "/contact" },
  { label: "FAQs", to: "/contact" },
];

function LinkColumn({ title, links }) {
  return (
    <div>
      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-white">
        {title}
      </h3>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              to={link.to}
              className="text-sm text-navy-300 transition hover:text-brand-400"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-navy-900 text-navy-300">
      <div className="container-page grid grid-cols-2 gap-10 py-14 md:grid-cols-4 lg:grid-cols-5">
        {/* Brand */}
        <div className="col-span-2">
          <div className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
                className="h-6 w-6 text-white"
                aria-hidden="true"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
              </svg>
            </span>
            <span className="font-display text-2xl tracking-wider text-white">
              STRIKESHIELD
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Premium boxing and combat gear built for fighters who demand the
            best. Train harder, hit harder, stay protected.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: FacebookIcon, label: "Facebook" },
              { Icon: TwitterIcon, label: "Twitter" },
              { Icon: InstagramIcon, label: "Instagram" },
              { Icon: LinkedInIcon, label: "LinkedIn" },
            ].map(({ Icon, label }) => (
              <a
                key={label}
                href="#"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-navy-800 text-navy-300 transition hover:bg-brand-600 hover:text-white"
              >
                <Icon fontSize="small" />
              </a>
            ))}
          </div>
        </div>

        <LinkColumn title="Shop" links={shopLinks} />
        <LinkColumn title="Company" links={companyLinks} />
        <LinkColumn title="Support" links={supportLinks} />
      </div>

      <div className="border-t border-navy-800">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-5 text-xs text-navy-400 sm:flex-row">
          <p>© {new Date().getFullYear()} StrikeShield. All rights reserved.</p>
          <p>Built as a portfolio MERN project.</p>
        </div>
      </div>
    </footer>
  );
}
