import NavBar from "@components/Navbar";

export const metadata = {
  title: "Task Flow",
  description: "Task Flow is a simple task management app.",
};

const Layout = ({ children }) => {
  return (
    <>
      <div className="main">
        <div className="gradient" />
      </div>

      <main className="app">
        <NavBar />
        {children}
      </main>
    </>
  );
};

export default Layout;
