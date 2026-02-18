/**
 * Utility to unify household items (Tasks, Cleaning, Meals, Appointments)
 * into a single view for the Today tab
 */

export interface HouseholdItem {
  id: string;
  title: string;
  category: 'task' | 'cleaning' | 'meal' | 'appointment';
  dueDate?: string;
  dueTime?: string;
  completed: boolean;
  icon: string;
  action?: () => void;
}

export function getHouseholdItems(): HouseholdItem[] {
  const items: HouseholdItem[] = [];

  try {
    // Load Tasks
    const tasksData = localStorage.getItem('jadePersonalTasks');
    if (tasksData) {
      try {
        const tasks = JSON.parse(tasksData);
        if (Array.isArray(tasks)) {
          tasks.forEach((task: any) => {
            if (task && !task.completed) {
              items.push({
                id: `task-${task.id}`,
                title: task.title || task.name || '',
                category: 'task',
                dueDate: task.dueDate,
                completed: false,
                icon: '✓',
              });
            }
          });
        }
      } catch (e) {
        console.log('Could not parse tasks');
      }
    }

    // Load Cleaning Schedule
    const cleaningData = localStorage.getItem('jadeCleaningSchedule');
    if (cleaningData) {
      try {
        const cleaning = JSON.parse(cleaningData);
        if (Array.isArray(cleaning)) {
          cleaning.forEach((item: any) => {
            if (item && !item.completed) {
              items.push({
                id: `cleaning-${item.id}`,
                title: item.task || item.title || '',
                category: 'cleaning',
                dueDate: item.dueDate || item.date,
                completed: false,
                icon: '🧹',
              });
            }
          });
        }
      } catch (e) {
        console.log('Could not parse cleaning');
      }
    }

    // Load Meal Planning
    const mealsData = localStorage.getItem('jadeMealPlanning');
    if (mealsData) {
      try {
        const meals = JSON.parse(mealsData);
        if (Array.isArray(meals)) {
          meals.forEach((day: any) => {
            if (day && day.meals) {
              // Check if any meals are due today/urgent
              ['breakfast', 'lunch', 'snack', 'dinner'].forEach((mealType: string) => {
                const mealList = day.meals[mealType as keyof typeof day.meals];
                if (Array.isArray(mealList) && mealList.length > 0) {
                  items.push({
                    id: `meal-${day.date}-${mealType}`,
                    title: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)}: ${mealList.join(', ')}`,
                    category: 'meal',
                    dueDate: day.date,
                    completed: false,
                    icon: '🍽️',
                  });
                }
              });
            }
          });
        }
      } catch (e) {
        console.log('Could not parse meals');
      }
    }

    // Load Appointments
    const appointmentsData = localStorage.getItem('jadeAppointments');
    if (appointmentsData) {
      try {
        const appointments = JSON.parse(appointmentsData);
        if (Array.isArray(appointments)) {
          appointments.forEach((apt: any) => {
            if (apt && !apt.completed) {
              items.push({
                id: `apt-${apt.id}`,
                title: apt.title || apt.name || `Appointment at ${apt.time}`,
                category: 'appointment',
                dueDate: apt.date,
                dueTime: apt.time,
                completed: false,
                icon: '📅',
              });
            }
          });
        }
      } catch (e) {
        console.log('Could not parse appointments');
      }
    }
  } catch (error) {
    console.error('Error loading household items:', error);
  }

  return items.sort((a, b) => {
    // Sort by due date (today first)
    if (a.dueDate && b.dueDate) {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    return a.dueDate ? -1 : 1;
  });
}

export function markHouseholdItemDone(itemId: string): void {
  const [type, ...rest] = itemId.split('-');
  
  switch (type) {
    case 'task':
      updateInStorage('jadePersonalTasks', rest.join('-'));
      break;
    case 'cleaning':
      updateInStorage('jadeCleaningSchedule', rest.join('-'));
      break;
    case 'meal':
      // Meals are harder to mark as done due to structure
      console.log('Marking meal as done not yet implemented');
      break;
    case 'apt':
      updateInStorage('jadeAppointments', rest.join('-'));
      break;
  }
}

function updateInStorage(key: string, itemId: string): void {
  const data = localStorage.getItem(key);
  if (data) {
    try {
      const items = JSON.parse(data);
      const updated = items.map((item: any) =>
        item.id === itemId ? { ...item, completed: true } : item
      );
      localStorage.setItem(key, JSON.stringify(updated));
      window.dispatchEvent(new StorageEvent('storage', { key }));
    } catch (e) {
      console.error(`Could not update ${key}`);
    }
  }
}
