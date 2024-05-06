const Footer = () => {
  return (
    <footer className="mt-auto w-full border-t border-t-foreground/10 p-4 flex justify-center text-center text-xs bg-main-theme text-white">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} SN Mart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
