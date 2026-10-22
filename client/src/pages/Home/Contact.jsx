import { useState } from "react";
import { toast } from "react-toastify";
import EmailIcon from "@mui/icons-material/Email";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneIcon from "@mui/icons-material/Phone";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";
import api from "../../api/axios.js";

const contactInfo = [
  { Icon: EmailIcon, label: "Email", value: "support@strikeship.com" },
  { Icon: PhoneIcon, label: "Phone", value: "+91 XXXX XXXXX" },
  { Icon: LocationOnIcon, label: "Address", value: "Mumbai, Maharashtra, India" },
];

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const submitResponse = async () => {
    if ([name, email, message].some((ele) => ele.trim() === "")) {
      toast.warn("Kindly fill in all the information");
      return;
    }
    setSubmitting(true);
    try {
      const res = await api.post("/user/sendfeedback/", {
        name,
        email,
        message,
      });
      if (res.status === 200) {
        toast.success("Thank you for sharing your feedback!");
        setName("");
        setEmail("");
        setMessage("");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Response was not submitted. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-navy-50">
      {/* Header */}
      <section className="bg-navy-900 py-14 text-white lg:py-16">
        <div className="container-page text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-brand-500">
            Get in touch
          </span>
          <h1 className="mt-2 font-display text-5xl tracking-wide">Contact Us</h1>
          <p className="mx-auto mt-3 max-w-xl text-navy-300">
            We&apos;d love to hear from you. Questions about an order, a product,
            or just want to say hello? Drop us a message.
          </p>
        </div>
      </section>

      <section className="container-page -mt-10 py-16">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Info cards */}
          <div className="space-y-4">
            {contactInfo.map(({ Icon, label, value }) => (
              <div key={label} className="card flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-50">
                  <Icon sx={{ fontSize: 24, color: "#ea580c" }} />
                </span>
                <div>
                  <p className="text-sm text-navy-500">{label}</p>
                  <p className="font-semibold text-navy-900">{value}</p>
                </div>
              </div>
            ))}

            <div className="card p-5">
              <p className="text-sm font-semibold text-navy-900">Follow us</p>
              <div className="mt-3 flex gap-3">
                {[
                  { Icon: FacebookIcon, label: "Facebook" },
                  { Icon: TwitterIcon, label: "Twitter" },
                  { Icon: InstagramIcon, label: "Instagram" },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-navy-100 text-navy-600 transition hover:bg-brand-600 hover:text-white"
                  >
                    <Icon fontSize="small" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="card p-8 lg:col-span-2">
            <h2 className="text-2xl font-bold text-navy-900">
              Send us a message
            </h2>
            <p className="mt-1 text-navy-500">
              We typically respond within one business day.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                submitResponse();
              }}
              className="mt-6"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="text-sm font-semibold text-navy-800">
                    Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="input-base mt-1.5"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-sm font-semibold text-navy-800">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="input-base mt-1.5"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="message" className="text-sm font-semibold text-navy-800">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={6}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help?"
                  className="input-base mt-1.5 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary mt-5"
              >
                {submitting ? "Submitting…" : "Submit Response"}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
