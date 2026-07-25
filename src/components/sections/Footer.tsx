import { FOOTER } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="luxury-footer px-6 py-14 text-center">
      <div className="ornamental-line mx-auto mb-6 w-24" />
      <p className="font-heading text-lg font-light italic text-text-primary sm:text-xl">
        {FOOTER.family}
      </p>
      <p className="mx-auto mt-3 max-w-md font-body text-sm leading-relaxed tracking-wide text-text-secondary sm:text-base">
        {FOOTER.signOff}
      </p>
      <div className="ornamental-line mx-auto mt-6 w-24" />
    </footer>
  );
}
