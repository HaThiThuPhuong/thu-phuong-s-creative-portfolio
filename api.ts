async function safeFetch(url: string, defaultValue: any) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.warn(`Fetch to ${url} failed with status ${res.status}`);
      return defaultValue;
    }
    const text = await res.text();
    if (!text) return defaultValue;
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error(`Failed to parse JSON from ${url}:`, text);
      return defaultValue;
    }
  } catch (err) {
    console.error(`Network error fetching ${url}:`, err);
    return defaultValue;
  }
}

export async function fetchProfile() {
  return safeFetch('/api/profile', {});
}

export async function fetchAssets(type?: string) {
  const url = type ? `/api/assets?type=${type}` : '/api/assets';
  return safeFetch(url, []);
}

export async function fetchServices(mode?: 'model' | 'ba') {
  const url = mode ? `/api/services?mode=${mode}` : '/api/services';
  return safeFetch(url, []);
}

export async function fetchMilestones() {
  return safeFetch('/api/milestones', []);
}

export async function fetchBAProjects() {
  return safeFetch('/api/ba-projects', []);
}

export async function fetchLifeHobbies() {
  return safeFetch('/api/life-hobbies', []);
}
