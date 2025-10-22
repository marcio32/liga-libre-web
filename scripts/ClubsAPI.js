async function loadClubs() {
    const response = await fetch(`${API_BASE_URL}/Clubs/GetAllClubs`, {
        headers: getAuthHeaders()
    });
    return await response.json();
}