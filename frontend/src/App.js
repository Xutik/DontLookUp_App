import { useEffect, useState } from "react";
import "./App.css";
import { fetchData, apiUrl } from "./services/api";
import { isoToDDMMYYYY, ddmmyyyyToISO } from "./utils/dateUtils";
import { DataEntrySection, DataSection, Footer, Header, LoginModal, Notification, PaginationSection, SearchBar, VisualizationSection } from "./components";

// Main App Component
export default function App() {
  const [paginatedData, setPaginatedData] = useState({
    data: [],
    metadata: {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false,
      search: "",
    },
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchCount, setSearchCount] = useState(0);
  // console.log("searchCount", searchCount);

  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const [action, setAction] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    diameter: "",
    distance: "",
    date: "",
    impact: "",
    range: "",
    relativeVelocity: "",
  });

  // Auth state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loginPassword, setLoginPassword] = useState("");
  const [userRole, setUserRole] = useState(null); // null | "scientist" | "observer"

  // Error handling state
  const [notification, setNotification] = useState({
    show: false,
    type: null, // 'success', 'error'
    message: "",
  });

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: null,
        message: "",
      });
    }, 5000);
  };

  // Fetch paginated data with search
  const fetchPaginatedObjects = async (page = 1, limit = 10, search = "") => {
    try {
      const endpoint = `${apiUrl}/objects/paginate?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const response = await fetchData(endpoint);
      setPaginatedData(response);
    } catch (error) {
      console.error("Error fetching paginated objects:", error);
      showNotification("error", "Failed to load space objects. Server may be unavailable.");
    }
  };

  // Debounce search query to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1); // Reset to first page when search changes
    }, 300); 

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Load data when page, items per page, or search changes
  useEffect(() => {
    fetchPaginatedObjects(currentPage, itemsPerPage, debouncedSearchQuery);
  }, [currentPage, itemsPerPage, debouncedSearchQuery]);

  useEffect(() => {
    if (debouncedSearchQuery.trim() !== "") {
      setSearchCount(count => count + 1);
    }
  }, [debouncedSearchQuery]);

  const handleSubmit = async () => {
    try {
      const { name, ...rest } = formData;

      // Validate form before submission
      const requiredFields = ["name", "diameter", "distance", "date", "impact", "range", "relativeVelocity"];
      const missingFields = requiredFields.filter(field => !formData[field]);

      if (missingFields.length > 0) {
        showNotification("error", `Missing required fields: ${missingFields.join(", ")}`);
        return;
      }

      if (action === "ADD") {
        const response = await fetchData(`${apiUrl}/create`, {
          method: "POST",
          body: { ...rest, name, date: ddmmyyyyToISO(formData.date) },
        });

        if (response.message) {
          showNotification("success", `Space object "${name}" created successfully`);
          setSearchQuery("");
          handleClear();
        }
      }

      if (action === "EDIT") {
        const response = await fetchData(`${apiUrl}/update/${name}`, {
          method: "PUT",
          body: { ...rest, date: ddmmyyyyToISO(formData.date) },
        });

        if (response.message) {
          showNotification("success", `Space object "${name}" updated successfully`);
          handleClear();
        }
      }

      setAction(null);
      // Refresh data after changes
      fetchPaginatedObjects(currentPage, itemsPerPage, debouncedSearchQuery);
    } catch (error) {
      console.error("Error handling form submission:", error);
      let errorMessage = "An unexpected error occurred.";
      if (error.message) {
        errorMessage = error.message;
      } else if (typeof error === "string") {
        errorMessage = error;
      }

      if (action === "ADD") {
        showNotification("error", `Failed to create space object: ${errorMessage}`);
      } else {
        showNotification("error", `Failed to update space object: ${errorMessage}`);
      }
    }
  };

  const handleClear = () => {
    setFormData({
      name: "",
      diameter: "",
      distance: "",
      date: "",
      impact: "",
      range: "",
      relativeVelocity: "",
    });
    setAction(null);
  };

  function handleEditRow(body) {
    setFormData({
      name: body.name || "",
      diameter: body.diameter || 0,
      distance: body.distance || "",
      date: isoToDDMMYYYY(body.date), // Format for input
      impact: body.impact || "",
      relativeVelocity: body.relativeVelocity || "",
      range: body.range || "",
    });
    setAction("EDIT");
  }

  function handleAddRow() {
    setFormData({
      name: searchQuery,
      diameter: "",
      distance: "",
      date: "",
      impact: "",
      range: "",
      relativeVelocity: "",
    });
    setAction("ADD");
  }

  // Handle delete object
  const handleDeleteObject = async name => {
    if (!window.confirm(`Are you sure you want to delete ${name}?`)) {
      return;
    }

    try {
      const response = await fetchData(`${apiUrl}/delete/${name}`, {
        method: "DELETE",
      });

      if (response.message) {
        showNotification("success", `Successfully deleted space object: ${name}`);
        fetchPaginatedObjects(currentPage, itemsPerPage, debouncedSearchQuery);
      }
    } catch (error) {
      console.error("Error deleting object:", error);
      showNotification("error", `Failed to delete space object: ${name}`);
    }
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (paginatedData.metadata.hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (paginatedData.metadata.hasPrevPage) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleItemsPerPageChange = e => {
    const newLimit = parseInt(e.target.value);
    setItemsPerPage(newLimit);
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  // Authentication
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setLoginPassword("");
  };

  useEffect(() => {
    openModal();
  }, []);

  const handleLogin = async () => {
    try {
      if (!loginPassword.trim()) {
        showNotification("error", "Please enter a password");
        return;
      }

      const response = await fetchData(`${apiUrl}/login`, {
        method: "POST",
        body: { password: loginPassword },
      });

      if (!response?.ok) {
        showNotification("error", "Login failed: Invalid credentials");
        return;
      }

      setUserRole(response.role);
      closeModal();
      showNotification("success", `Login successful. Welcome, ${response.role}!`);
    } catch (error) {
      console.error("Login error:", error);
      showNotification("error", "Login failed. Please try again.");
    }
  };

  return (
    <main className="crt" aria-label="Space Object Management System">
      <Notification notification={notification} setNotification={setNotification} />

      <LoginModal isOpen={isModalOpen} loginPassword={loginPassword} setLoginPassword={setLoginPassword} handleLogin={handleLogin} />

      <Header />

      <div className="search-bar">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        {userRole === "scientist" && (
          <button className="add-btn" onClick={handleAddRow} aria-label="Add new space object">
            + Add Space Object
          </button>
        )}
      </div>

      <VisualizationSection objects={paginatedData.data} />

      {userRole === "scientist" && action && (
        <DataEntrySection action={action} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} handleClear={handleClear} />
      )}

      <DataSection
        paginatedData={paginatedData}
        userRole={userRole}
        debouncedSearchQuery={debouncedSearchQuery}
        handleEditRow={handleEditRow}
        handleDeleteObject={handleDeleteObject}
      />

      <PaginationSection
        paginatedData={paginatedData}
        debouncedSearchQuery={debouncedSearchQuery}
        handlePrevPage={handlePrevPage}
        handleNextPage={handleNextPage}
        itemsPerPage={itemsPerPage}
        handleItemsPerPageChange={handleItemsPerPageChange}
      />

      <Footer />
    </main>
  );
}
