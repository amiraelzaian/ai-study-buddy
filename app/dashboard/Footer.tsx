import Link from "next/link";

function Footer() {
  return (
    <div className="flex flex-col gap-2 items-center py-6 ">
      <section className="text-secondary-foreground flex flex-wrap gap-4 mx-auto text-sm">
        <Link
          href="https://www.linkedin.com/in/amira-alzaian-0323902a1"
          className="hover:text-primary-500 transition-colors"
        >
          LinkedIn
        </Link>
        <Link
          href="https://www.facebook.com/share/1CprnCVTHr/"
          className="hover:text-primary-500 transition-colors"
        >
          FaceBook
        </Link>
        <Link
          href="https://www.instagram.com/mera.20.4.5?igsh=djdsNXFsOGk4NzJn"
          className="hover:text-primary-500 transition-colors"
        >
          Instagram
        </Link>
        <Link
          href="https://amira-alzaian-website.netlify.app/"
          className="hover:text-primary-500 transition-colors"
        >
          Portfolio
        </Link>
      </section>
      <p className="text-sm text-muted-foreground">
        © {new Date().getFullYear()} developed by Amira Alzaian
      </p>
    </div>
  );
}

export default Footer;
