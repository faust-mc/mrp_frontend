import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function RestrictRoute({ children, modules, requiredModuleSlug }) {
  const navigate = useNavigate();
 
  useEffect(() => {
    // Only run the check after modules are loaded
    if (modules.length === 0) {
      return; // You could also show a loading spinner here
    }
    // update this in future to check also if submodule
    const hasModuleAccess = modules.some(module => module.slug === requiredModuleSlug);

    if (!hasModuleAccess) {
      navigate("/not-authorized");
    }
  }, [modules, requiredModuleSlug, navigate]);

  // If modules are still being loaded, show a loading message
  if (modules.length === 0) {
    return <div>Loading...</div>;
  }

  return children;
}

export default RestrictRoute;
