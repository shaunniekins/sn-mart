// Footer.tsx

const Footer = () => {
  return (
    <footer className="mt-auto bg-purple-800 text-white p-4">
      <div className="container mx-auto text-center">
        <p>© {new Date().getFullYear()} SN Mart. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
