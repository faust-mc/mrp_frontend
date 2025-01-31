import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestrictRoute({ children, modules, requiredModuleSlug }) {
  const navigate = useNavigate();
 
  useEffect(() => {
    //only run the check after modules are loaded
    if (modules.length === 0) {
      return;
    }
    // update this in future to check also if submodule
    const hasModuleAccess = modules.some(module => module.slug === requiredModuleSlug);

    if (!hasModuleAccess) {
      navigate("/not-authorized");
    }
  }, [modules, requiredModuleSlug, navigate]);

  //if modules are still loading, show a loading message
  if (modules.length === 0) {
    return <div>Loading...</div>;
  }

  return children;
}

export default RestrictRoute;
