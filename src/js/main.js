document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const resultContainer = document.querySelector(".result-container");
  const tableRows = document.querySelectorAll(".result-row");
  const noResultsDiv = document.querySelector(".noResults");
  const tableResponsive = document.querySelector(".table-responsive");

  // Hide result container initially
  resultContainer.style.display = "none";

  // Add click event listener to each row for navigation
  tableRows.forEach((row) => {
    row.addEventListener("click", () => {
      window.location.href = "container-details.html";
    });
  });

  // Add input event listener for search functionality in the table
  searchInput.addEventListener("input", function () {
    const searchValue = this.value.trim().toLowerCase();
    let hasVisibleRows = false;

    // Toggle visibility of result container
    if (searchValue.length > 0) {
      resultContainer.style.display = "flex";
    } else {
      resultContainer.style.display = "none";
    }

    // Filter table rows
    tableRows.forEach((row) => {
      const bookingNo = row.children[0].textContent.toLowerCase();
      const vesselCode = row.children[1].textContent.toLowerCase();
      const shipper = row.children[2].textContent.toLowerCase();

      if (
        bookingNo.includes(searchValue) ||
        vesselCode.includes(searchValue) ||
        shipper.includes(searchValue)
      ) {
        row.style.display = ""; // Show matching row
        hasVisibleRows = true;
      } else {
        row.style.display = "none"; // Hide non-matching row
      }
    });

    // Show or hide no results message
    if (hasVisibleRows) {
      tableResponsive.style.display = "block";
      noResultsDiv.style.display = "none";
    } else {
      tableResponsive.style.display = "none";
      noResultsDiv.style.display = "block";
    }
  });
});
