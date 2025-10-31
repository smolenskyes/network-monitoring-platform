const state = {
  token: localStorage.getItem("authToken"),
  selectedDevice: null,
};

const elements = {
  currentYear: document.getElementById("current-year"),
  loginForm: document.getElementById("login-form"),
  logoutButton: document.getElementById("logout-button"),
  authStatus: document.getElementById("auth-status"),
  refreshDevices: document.getElementById("refresh-devices"),
  devicesTableBody: document.getElementById("devices-table-body"),
  createDeviceForm: document.getElementById("create-device-form"),
  createDeviceStatus: document.getElementById("create-device-status"),
  deviceDetailsCard: document.getElementById("device-details"),
  deviceDetailsTitle: document.getElementById("device-details-title"),
  statusDetails: document.getElementById("status-details"),
  metricsList: document.getElementById("metrics-list"),
  interfacesBody: document.getElementById("interfaces-body"),
  detailsStatus: document.getElementById("details-status"),
  checkNow: document.getElementById("check-now"),
};

elements.currentYear.textContent = new Date().getFullYear();

function updateAuthUI() {
  if (state.token) {
    elements.authStatus.textContent = "Токен сохранён. Запросы выполняются с авторизацией.";
    elements.authStatus.className = "status-text success";
    elements.logoutButton.hidden = false;
  } else {
    elements.authStatus.textContent = "Вы не авторизованы. Некоторые операции могут быть недоступны.";
    elements.authStatus.className = "status-text";
    elements.logoutButton.hidden = true;
  }
}

function setStatus(element, message, type = "") {
  element.textContent = message;
  element.className = type ? `status-text ${type}` : "status-text";
}

async function apiRequest(path, options = {}) {
  const config = { ...options };
  config.headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData)) {
    config.body = JSON.stringify(options.body);
    if (!config.headers.has("Content-Type")) {
      config.headers.set("Content-Type", "application/json");
    }
  }

  if (state.token && !config.headers.has("Authorization")) {
    config.headers.set("Authorization", `Bearer ${state.token}`);
  }

  try {
    const response = await fetch(path, config);
    const text = await response.text();
    let data = null;

    if (text) {
      try {
        data = JSON.parse(text);
      } catch (err) {
        data = text;
      }
    }

    if (!response.ok) {
      const errorMessage = typeof data === "string" ? data : data?.detail || "Ошибка подключения";
      const error = new Error(errorMessage);
      error.status = response.status;
      error.payload = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === "TypeError" && !navigator.onLine) {
      throw new Error("Нет соединения с сетью. Проверьте подключение.");
    }
    throw error;
  }
}

function renderDevices(devices) {
  elements.devicesTableBody.innerHTML = "";

  if (!Array.isArray(devices) || devices.length === 0) {
    elements.devicesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty">Устройства не найдены.</td>
      </tr>`;
    return;
  }

  devices.forEach((device) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${device.ip_address || "—"}</td>
      <td>${device.hostname || "—"}</td>
      <td>${device.vendor || "—"}</td>
      <td>${device.device_type || "—"}</td>
      <td>${device.last_seen ? new Date(device.last_seen).toLocaleString() : "—"}</td>`;
    row.addEventListener("click", () => selectDevice(device));
    elements.devicesTableBody.appendChild(row);
  });
}

async function loadDevices() {
  setStatus(elements.createDeviceStatus, "", "");
  try {
    const devices = await apiRequest("/api/discovery/devices");
    renderDevices(devices);
  } catch (error) {
    console.error("Не удалось получить список устройств", error);
    elements.devicesTableBody.innerHTML = `
      <tr>
        <td colspan="5" class="empty">Ошибка загрузки: ${error.message}</td>
      </tr>`;
  }
}

function renderStatus(status) {
  elements.statusDetails.innerHTML = "";
  if (!status) {
    elements.statusDetails.innerHTML = "<p>Данные о состоянии недоступны.</p>";
    return;
  }

  const items = [
    ["IP", status.device_ip],
    ["Онлайн", status.is_online ? "Да" : "Нет"],
    ["Время отклика", status.response_time ? `${status.response_time.toFixed(2)} мс` : "—"],
    ["Последняя проверка", status.last_check ? new Date(status.last_check).toLocaleString() : "—"],
    ["Uptime", status.uptime ? `${Math.round(status.uptime / 60)} мин` : "—"],
  ];

  items.forEach(([term, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = term;
    const dd = document.createElement("dd");
    dd.textContent = value ?? "—";
    elements.statusDetails.append(dt, dd);
  });
}

function renderMetrics(metrics) {
  elements.metricsList.innerHTML = "";
  if (!Array.isArray(metrics) || metrics.length === 0) {
    elements.metricsList.innerHTML = "<li>Метрики отсутствуют.</li>";
    return;
  }

  metrics.slice(0, 6).forEach((metric) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span>${metric.metric_name}</span>
      <strong>${metric.metric_value} ${metric.unit || ""}</strong>`;
    elements.metricsList.appendChild(li);
  });
}

function renderInterfaces(interfaces) {
  elements.interfacesBody.innerHTML = "";
  if (!Array.isArray(interfaces) || interfaces.length === 0) {
    elements.interfacesBody.innerHTML = `
      <tr>
        <td colspan="6" class="empty">Нет информации по интерфейсам.</td>
      </tr>`;
    return;
  }

  interfaces.forEach((iface) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${iface.interface_name || "—"}</td>
      <td>${iface.admin_status || "—"}</td>
      <td>${iface.oper_status || "—"}</td>
      <td>${iface.bandwidth_usage != null ? `${iface.bandwidth_usage.toFixed(2)} Mbps` : "—"}</td>
      <td>${iface.error_count ?? "—"}</td>
      <td>${iface.timestamp ? new Date(iface.timestamp).toLocaleString() : "—"}</td>`;
    elements.interfacesBody.appendChild(row);
  });
}

async function loadDeviceDetails(ip) {
  elements.detailsStatus.textContent = "Загрузка данных устройства...";
  elements.detailsStatus.className = "status-text";

  try {
    const [status, metrics, interfaces] = await Promise.all([
      apiRequest(`/api/monitoring/devices/${encodeURIComponent(ip)}/status`).catch((err) => {
        if (err.status === 404) {
          return null;
        }
        throw err;
      }),
      apiRequest(`/api/monitoring/devices/${encodeURIComponent(ip)}/metrics?limit=10`).catch((err) => {
        if (err.status === 404) {
          return [];
        }
        throw err;
      }),
      apiRequest(`/api/monitoring/devices/${encodeURIComponent(ip)}/interfaces`).catch((err) => {
        if (err.status === 404) {
          return [];
        }
        throw err;
      }),
    ]);

    renderStatus(status);
    renderMetrics(metrics);
    renderInterfaces(interfaces);
    setStatus(elements.detailsStatus, "Данные успешно обновлены", "success");
  } catch (error) {
    console.error("Ошибка при загрузке данных устройства", error);
    setStatus(elements.detailsStatus, `Не удалось загрузить данные: ${error.message}`, "error");
  }
}

function selectDevice(device) {
  state.selectedDevice = device;
  elements.deviceDetailsCard.hidden = false;
  elements.deviceDetailsTitle.textContent = `Детали устройства ${device.ip_address}`;
  loadDeviceDetails(device.ip_address);
}

async function handleLogin(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const credentials = Object.fromEntries(formData.entries());

  setStatus(elements.authStatus, "Выполняется вход...");

  try {
    const response = await apiRequest("/api/auth/login", {
      method: "POST",
      body: credentials,
    });

    if (response?.access_token) {
      state.token = response.access_token;
      localStorage.setItem("authToken", state.token);
      setStatus(elements.authStatus, "Успешный вход. Токен сохранён.", "success");
      updateAuthUI();
    } else {
      throw new Error("Некорректный ответ сервера");
    }
  } catch (error) {
    console.error("Ошибка авторизации", error);
    setStatus(elements.authStatus, `Не удалось выполнить вход: ${error.message}`, "error");
  }
}

function handleLogout() {
  state.token = null;
  localStorage.removeItem("authToken");
  updateAuthUI();
  setStatus(elements.authStatus, "Вы вышли из системы.", "success");
}

async function handleCreateDevice(event) {
  event.preventDefault();
  const formData = new FormData(event.target);
  const payload = Object.fromEntries(formData.entries());

  Object.keys(payload).forEach((key) => {
    if (payload[key] === "") {
      delete payload[key];
    }
  });

  setStatus(elements.createDeviceStatus, "Отправка запроса...");

  try {
    await apiRequest("/api/discovery/devices", {
      method: "POST",
      body: payload,
    });
    setStatus(elements.createDeviceStatus, "Устройство добавлено.", "success");
    event.target.reset();
    await loadDevices();
  } catch (error) {
    console.error("Не удалось добавить устройство", error);
    setStatus(elements.createDeviceStatus, `Ошибка: ${error.message}`, "error");
  }
}

async function handleCheckNow() {
  if (!state.selectedDevice) {
    setStatus(elements.detailsStatus, "Сначала выберите устройство", "error");
    return;
  }

  setStatus(elements.detailsStatus, "Запрос запущен...");

  try {
    await apiRequest(`/api/monitoring/devices/${encodeURIComponent(state.selectedDevice.ip_address)}/check-now`, {
      method: "POST",
      body: {},
    });
    setStatus(elements.detailsStatus, "Задача отправлена. Обновите данные через минуту.", "success");
  } catch (error) {
    console.error("Ошибка запуска опроса", error);
    setStatus(elements.detailsStatus, `Не удалось запустить опрос: ${error.message}`, "error");
  }
}

updateAuthUI();
loadDevices();

elements.loginForm.addEventListener("submit", handleLogin);
elements.logoutButton.addEventListener("click", handleLogout);
elements.refreshDevices.addEventListener("click", loadDevices);
elements.createDeviceForm.addEventListener("submit", handleCreateDevice);
elements.checkNow.addEventListener("click", handleCheckNow);
