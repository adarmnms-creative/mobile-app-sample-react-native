
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Status = "To Do" | "In Progress" | "Done";
type Priority = "Low" | "Medium" | "High";

type Task = {
  id: string;
  title: string;
  description: string;
  status: Status;
  priority: Priority;
  assignee: string;
  dueDate: string;
  projectId: string;
};

type Project = {
  id: string;
  name: string;
  color: string;
};

const COLORS = {
  background: "#F5F7FB",
  white: "#FFFFFF",
  primary: "#2563EB",
  text: "#172033",
  muted: "#7B8498",
  border: "#E8ECF3",
  blueLight: "#EAF1FF",
  green: "#15966A",
  orange: "#D97706",
  red: "#DC4C4C",
};

const INITIAL_PROJECTS: Project[] = [
  { id: "p1", name: "Website Redesign", color: "#2563EB" },
  { id: "p2", name: "Mobile App", color: "#8B5CF6" },
  { id: "p3", name: "Marketing", color: "#EA580C" },
];

const INITIAL_TASKS: Task[] = [
  {
    id: "1",
    title: "Design dashboard UI",
    description: "Create the main dashboard layout and reusable components.",
    status: "In Progress",
    priority: "High",
    assignee: "Addy",
    dueDate: "2026-10-25",
    projectId: "p1",
  },
  {
    id: "2",
    title: "Create login screen",
    description: "Design the login and registration experience.",
    status: "To Do",
    priority: "Medium",
    assignee: "Alex",
    dueDate: "2026-10-27",
    projectId: "p2",
  },
  {
    id: "3",
    title: "Fix navigation bugs",
    description: "Check screen navigation and back button behavior.",
    status: "In Progress",
    priority: "High",
    assignee: "Addy",
    dueDate: "2026-10-24",
    projectId: "p2",
  },
  {
    id: "4",
    title: "Prepare design assets",
    description: "Organize icons and illustrations.",
    status: "Done",
    priority: "Low",
    assignee: "Jamie",
    dueDate: "2026-10-20",
    projectId: "p1",
  },
  {
    id: "5",
    title: "Review landing page",
    description: "Review spacing, typography, and responsiveness.",
    status: "To Do",
    priority: "High",
    assignee: "Addy",
    dueDate: "2026-10-29",
    projectId: "p1",
  },
];

const STATUSES: Status[] = ["To Do", "In Progress", "Done"];
const PRIORITIES: Priority[] = ["Low", "Medium", "High"];

type Screen = "Dashboard" | "Projects" | "My Tasks" | "Board";

export default function Index() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [screen, setScreen] = useState<Screen>("Dashboard");
  const [projectId, setProjectId] = useState("p1");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | Status>("All");
  const [modalVisible, setModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("Medium");
  const [status, setStatus] = useState<Status>("To Do");
  const [assignee, setAssignee] = useState("Addy");
  const [dueDate, setDueDate] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("p1");

  const activeProject = projects.find((p) => p.id === projectId);

  const visibleTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch =
        task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.description.toLowerCase().includes(search.toLowerCase());

      const matchesProject =
        screen === "My Tasks"
          ? task.assignee.toLowerCase() === "addy"
          : screen === "Dashboard"
            ? true
            : task.projectId === projectId;

      const matchesStatus = filter === "All" || task.status === filter;

      return matchesSearch && matchesProject && matchesStatus;
    });
  }, [tasks, search, screen, projectId, filter]);

  const openNewTask = () => {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setStatus("To Do");
    setAssignee("Addy");
    setDueDate("");
    setTaskProjectId(projectId);
    setModalVisible(true);
  };

  const openEditTask = (task: Task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setStatus(task.status);
    setAssignee(task.assignee);
    setDueDate(task.dueDate);
    setTaskProjectId(task.projectId);
    setModalVisible(true);
  };

  const saveTask = () => {
    if (!title.trim()) {
      Alert.alert("Missing title", "Please enter a task title.");
      return;
    }

    const updatedTask: Task = {
      id: editingTask?.id ?? Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      assignee: assignee.trim() || "Unassigned",
      dueDate: dueDate.trim(),
      projectId: taskProjectId,
    };

    if (editingTask) {
      setTasks((current) =>
        current.map((task) =>
          task.id === editingTask.id ? updatedTask : task
        )
      );
    } else {
      setTasks((current) => [updatedTask, ...current]);
    }

    setModalVisible(false);
  };

  const deleteTask = (task: Task) => {
    Alert.alert("Delete task", `Delete "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          setTasks((current) =>
            current.filter((item) => item.id !== task.id)
          ),
      },
    ]);
  };

  const moveTask = (task: Task) => {
    const nextIndex = (STATUSES.indexOf(task.status) + 1) % STATUSES.length;
    const nextStatus = STATUSES[nextIndex];

    setTasks((current) =>
      current.map((item) =>
        item.id === task.id ? { ...item, status: nextStatus } : item
      )
    );
  };

  const createProject = () => {
    Alert.prompt?.(
      "New project",
      "Enter a project name",
      (name) => {
        if (!name?.trim()) return;

        const newProject: Project = {
          id: Date.now().toString(),
          name: name.trim(),
          color: "#0D9488",
        };

        setProjects((current) => [...current, newProject]);
        setProjectId(newProject.id);
        setScreen("Board");
      }
    );
  };

  const stats = {
    total: tasks.length,
    todo: tasks.filter((task) => task.status === "To Do").length,
    progress: tasks.filter((task) => task.status === "In Progress").length,
    done: tasks.filter((task) => task.status === "Done").length,
  };

  const pageTitle =
    screen === "Board"
      ? activeProject?.name ?? "Project Board"
      : screen === "My Tasks"
        ? "My Tasks"
        : screen;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.app}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logo}>
              <Ionicons name="grid" size={22} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.brandTitle}>Task Manager</Text>
              <Text style={styles.brandSubtitle}>PROJECT WORKSPACE</Text>
            </View>
          </View>

          <Pressable style={styles.avatar} onPress={() => Alert.alert("Profile", "Local demo profile: Addy")}>
            <Text style={styles.avatarText}>A</Text>
          </Pressable>
        </View>

        <View style={styles.pageHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.eyebrow}>WORKSPACE / {screen.toUpperCase()}</Text>
            <Text style={styles.pageTitle}>{pageTitle}</Text>
            <Text style={styles.pageSubtitle}>
              {screen === "Dashboard"
                ? "Here's what's happening with your work."
                : screen === "Board"
                  ? "Manage your project tasks."
                  : "Keep your work organized."}
            </Text>
          </View>

          <Pressable style={styles.addButton} onPress={openNewTask}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
            <Text style={styles.addButtonText}>Create</Text>
          </Pressable>
        </View>

        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color={COLORS.muted} />
          <TextInput
            placeholder="Search tasks..."
            placeholderTextColor={COLORS.muted}
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={19} color={COLORS.muted} />
            </Pressable>
          )}
        </View>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.contentInner}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {screen === "Dashboard" && (
            <>
              <View style={styles.welcomeCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.welcomeEyebrow}>YOUR WORKSPACE</Text>
                  <Text style={styles.welcomeTitle}>Make progress,</Text>
                  <Text style={styles.welcomeTitle}>one task at a time.</Text>
                  <Text style={styles.welcomeText}>
                    Plan your work and keep everything moving.
                  </Text>
                </View>
                <View style={styles.welcomeIcon}>
                  <Ionicons name="rocket-outline" size={32} color="#FFFFFF" />
                </View>
              </View>

              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.statsGrid}>
                <StatCard label="Total tasks" value={stats.total} icon="albums-outline" color="#2563EB" />
                <StatCard label="To do" value={stats.todo} icon="ellipse-outline" color="#D97706" />
                <StatCard label="In progress" value={stats.progress} icon="time-outline" color="#7C3AED" />
                <StatCard label="Completed" value={stats.done} icon="checkmark-circle-outline" color="#15966A" />
              </View>

              <SectionHeader title="Recent tasks" action="View all" onPress={() => setScreen("My Tasks")} />
              {tasks.slice(0, 4).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  project={projects.find((p) => p.id === task.projectId)?.name ?? "Project"}
                  onPress={() => openEditTask(task)}
                  onMove={() => moveTask(task)}
                  onDelete={() => deleteTask(task)}
                />
              ))}
            </>
          )}

          {screen === "Projects" && (
            <>
              <SectionHeader title="Your projects" action="+ New project" onPress={createProject} />
              {projects.map((project) => {
                const count = tasks.filter((task) => task.projectId === project.id).length;
                const completed = tasks.filter(
                  (task) => task.projectId === project.id && task.status === "Done"
                ).length;

                return (
                  <Pressable
                    key={project.id}
                    style={styles.projectCard}
                    onPress={() => {
                      setProjectId(project.id);
                      setScreen("Board");
                      setFilter("All");
                    }}
                  >
                    <View style={[styles.projectIcon, { backgroundColor: project.color + "18" }]}>
                      <Ionicons name="folder-open-outline" size={23} color={project.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.projectName}>{project.name}</Text>
                      <Text style={styles.projectMeta}>{count} tasks · {completed} completed</Text>
                      <View style={styles.progressTrack}>
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${count ? (completed / count) * 100 : 0}%`,
                              backgroundColor: project.color,
                            },
                          ]}
                        />
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color={COLORS.muted} />
                  </Pressable>
                );
              })}
            </>
          )}

          {(screen === "Board" || screen === "My Tasks") && (
            <>
              {screen === "Board" && (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.projectPicker}>
                  {projects.map((project) => (
                    <Pressable
                      key={project.id}
                      onPress={() => {
                        setProjectId(project.id);
                        setFilter("All");
                      }}
                      style={[
                        styles.projectChip,
                        projectId === project.id && styles.projectChipActive,
                      ]}
                    >
                      <Text style={[
                        styles.projectChipText,
                        projectId === project.id && styles.projectChipTextActive,
                      ]}>
                        {project.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}

              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
                {(["All", ...STATUSES] as ("All" | Status)[]).map((item) => (
                  <Pressable
                    key={item}
                    onPress={() => setFilter(item)}
                    style={[styles.filterChip, filter === item && styles.filterChipActive]}
                  >
                    <Text style={[styles.filterText, filter === item && styles.filterTextActive]}>
                      {item}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              {STATUSES.filter((s) => filter === "All" || filter === s).map((column) => {
                const columnTasks = visibleTasks.filter((task) => task.status === column);

                return (
                  <View key={column} style={styles.boardColumn}>
                    <View style={styles.columnHeader}>
                      <View style={[styles.statusDot, { backgroundColor: statusColor(column) }]} />
                      <Text style={styles.columnTitle}>{column}</Text>
                      <View style={styles.countBadge}>
                        <Text style={styles.countText}>{columnTasks.length}</Text>
                      </View>
                      <Pressable onPress={openNewTask} style={{ marginLeft: "auto" }}>
                        <Ionicons name="add" size={22} color={COLORS.muted} />
                      </Pressable>
                    </View>

                    {columnTasks.length === 0 ? (
                      <View style={styles.emptyColumn}>
                        <Ionicons name="file-tray-outline" size={24} color="#B1B8C7" />
                        <Text style={styles.emptyText}>No tasks here</Text>
                      </View>
                    ) : (
                      columnTasks.map((task) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          project={projects.find((p) => p.id === task.projectId)?.name ?? "Project"}
                          onPress={() => openEditTask(task)}
                          onMove={() => moveTask(task)}
                          onDelete={() => deleteTask(task)}
                        />
                      ))
                    )}
                  </View>
                );
              })}
            </>
          )}
        </ScrollView>

        <View style={styles.bottomNav}>
          <NavItem icon="grid-outline" label="Home" active={screen === "Dashboard"} onPress={() => { setScreen("Dashboard"); setFilter("All"); }} />
          <NavItem icon="folder-outline" label="Projects" active={screen === "Projects"} onPress={() => { setScreen("Projects"); setFilter("All"); }} />
          <NavItem icon="checkbox-outline" label="My Tasks" active={screen === "My Tasks"} onPress={() => { setScreen("My Tasks"); setFilter("All"); }} />
          <NavItem icon="albums-outline" label="Board" active={screen === "Board"} onPress={() => { setScreen("Board"); setFilter("All"); }} />
        </View>
      </View>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>{editingTask ? "Edit task" : "Create task"}</Text>
                <Text style={styles.modalSubtitle}>Add details to your task.</Text>
              </View>
              <Pressable onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <Text style={styles.inputLabel}>TASK TITLE *</Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="What needs to be done?"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
                autoFocus
              />

              <Text style={styles.inputLabel}>DESCRIPTION</Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Add more details..."
                placeholderTextColor={COLORS.muted}
                style={[styles.input, styles.multiline]}
                multiline
              />

              <Text style={styles.inputLabel}>PROJECT</Text>
              <View style={styles.optionRow}>
                {projects.map((project) => (
                  <Choice
                    key={project.id}
                    label={project.name}
                    active={taskProjectId === project.id}
                    onPress={() => setTaskProjectId(project.id)}
                  />
                ))}
              </View>

              <Text style={styles.inputLabel}>STATUS</Text>
              <View style={styles.optionRow}>
                {STATUSES.map((item) => (
                  <Choice key={item} label={item} active={status === item} onPress={() => setStatus(item)} />
                ))}
              </View>

              <Text style={styles.inputLabel}>PRIORITY</Text>
              <View style={styles.optionRow}>
                {PRIORITIES.map((item) => (
                  <Choice key={item} label={item} active={priority === item} onPress={() => setPriority(item)} />
                ))}
              </View>

              <Text style={styles.inputLabel}>ASSIGNEE</Text>
              <TextInput
                value={assignee}
                onChangeText={setAssignee}
                placeholder="Assignee name"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />

              <Text style={styles.inputLabel}>DUE DATE (YYYY-MM-DD)</Text>
              <TextInput
                value={dueDate}
                onChangeText={setDueDate}
                placeholder="2026-11-01"
                placeholderTextColor={COLORS.muted}
                style={styles.input}
              />

              <Pressable style={styles.saveButton} onPress={saveTask}>
                <Text style={styles.saveButtonText}>
                  {editingTask ? "Save changes" : "Create task"}
                </Text>
              </Pressable>

              {editingTask && (
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => {
                    setModalVisible(false);
                    deleteTask(editingTask);
                  }}
                >
                  <Text style={styles.deleteButtonText}>Delete task</Text>
                </Pressable>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function StatCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIcon, { backgroundColor: color + "16" }]}>
        <Ionicons name={icon} size={21} color={color} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function SectionHeader({
  title,
  action,
  onPress,
}: {
  title: string;
  action: string;
  onPress: () => void;
}) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Pressable onPress={onPress}>
        <Text style={styles.sectionAction}>{action}</Text>
      </Pressable>
    </View>
  );
}

function NavItem({
  icon,
  label,
  active,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.navItem} onPress={onPress}>
      <Ionicons name={icon} size={22} color={active ? COLORS.primary : COLORS.muted} />
      <Text style={[styles.navLabel, active && styles.navLabelActive]}>{label}</Text>
      {active && <View style={styles.navIndicator} />}
    </Pressable>
  );
}

function Choice({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.choice, active && styles.choiceActive]}
    >
      <Text style={[styles.choiceText, active && styles.choiceTextActive]}>{label}</Text>
    </Pressable>
  );
}

function TaskCard({
  task,
  project,
  onPress,
  onMove,
  onDelete,
}: {
  task: Task;
  project: string;
  onPress: () => void;
  onMove: () => void;
  onDelete: () => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Pressable style={styles.taskCard} onPress={onPress}>
      <View style={styles.taskTop}>
        <View style={styles.taskProject}>
          <View style={[styles.projectMiniDot, { backgroundColor: priorityColor(task.priority) }]} />
          <Text style={styles.taskProjectText} numberOfLines={1}>{project}</Text>
        </View>
        <Pressable
          hitSlop={8}
          onPress={(event) => {
            event.stopPropagation();
            setMenuOpen((open) => !open);
          }}
        >
          <Ionicons name="ellipsis-horizontal" size={21} color={COLORS.muted} />
        </Pressable>
      </View>

      {menuOpen && (
        <View style={styles.taskMenu}>
          <Pressable style={styles.menuOption} onPress={() => { setMenuOpen(false); onMove(); }}>
            <Text style={styles.menuText}>Move to next status</Text>
          </Pressable>
          <Pressable style={styles.menuOption} onPress={() => { setMenuOpen(false); onPress(); }}>
            <Text style={styles.menuText}>Edit task</Text>
          </Pressable>
          <Pressable style={styles.menuOption} onPress={() => { setMenuOpen(false); onDelete(); }}>
            <Text style={[styles.menuText, { color: COLORS.red }]}>Delete task</Text>
          </Pressable>
        </View>
      )}

      <Text style={styles.taskTitle}>{task.title}</Text>
      {task.description ? (
        <Text style={styles.taskDescription} numberOfLines={2}>{task.description}</Text>
      ) : null}

      <View style={styles.taskMetaRow}>
        <View style={[styles.priorityBadge, { backgroundColor: priorityColor(task.priority) + "16" }]}>
          <View style={[styles.priorityDot, { backgroundColor: priorityColor(task.priority) }]} />
          <Text style={[styles.priorityText, { color: priorityColor(task.priority) }]}>{task.priority}</Text>
        </View>
        <View style={styles.assigneeAvatar}>
          <Text style={styles.assigneeText}>{task.assignee.charAt(0).toUpperCase()}</Text>
        </View>
      </View>

      <View style={styles.taskFooter}>
        <View style={styles.taskFooterItem}>
          <Ionicons name="person-outline" size={14} color={COLORS.muted} />
          <Text style={styles.taskFooterText}>{task.assignee}</Text>
        </View>
        {task.dueDate ? (
          <View style={styles.taskFooterItem}>
            <Ionicons name="calendar-outline" size={14} color={COLORS.muted} />
            <Text style={styles.taskFooterText}>{task.dueDate}</Text>
          </View>
        ) : null}
      </View>

      <Pressable
        style={styles.moveButton}
        onPress={(event) => {
          event.stopPropagation();
          onMove();
        }}
      >
        <Ionicons name="arrow-forward-circle-outline" size={17} color={COLORS.primary} />
        <Text style={styles.moveButtonText}>Move to next status</Text>
      </Pressable>
    </Pressable>
  );
}

function statusColor(status: Status) {
  if (status === "To Do") return "#D97706";
  if (status === "In Progress") return "#7C3AED";
  return "#15966A";
}

function priorityColor(priority: Priority) {
  if (priority === "High") return "#DC4C4C";
  if (priority === "Medium") return "#D97706";
  return "#15966A";
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.background },
  app: { flex: 1 },
  header: {
    height: 66,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brandTitle: { fontSize: 19, fontWeight: "800", color: COLORS.text },
  brandSubtitle: { fontSize: 9, letterSpacing: 1.5, color: COLORS.muted, marginTop: 2 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#E8EFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#C9D8FF",
  },
  avatarText: { color: COLORS.primary, fontWeight: "800", fontSize: 15 },
  pageHeader: {
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  eyebrow: { fontSize: 9, letterSpacing: 1.4, color: COLORS.muted, fontWeight: "700" },
  pageTitle: { fontSize: 27, fontWeight: "800", color: COLORS.text, marginTop: 7 },
  pageSubtitle: { fontSize: 12, color: COLORS.muted, marginTop: 5 },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.primary,
    paddingHorizontal: 13,
    paddingVertical: 11,
    borderRadius: 10,
    gap: 4,
  },
  addButtonText: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
  searchBox: {
    marginHorizontal: 20,
    marginBottom: 17,
    height: 45,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 9,
  },
  searchInput: { flex: 1, fontSize: 13, color: COLORS.text },
  content: { flex: 1 },
  contentInner: { paddingHorizontal: 20, paddingBottom: 25 },
  welcomeCard: {
    backgroundColor: "#1D3F8F",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 24,
  },
  welcomeEyebrow: { color: "#BBD1FF", fontSize: 9, letterSpacing: 1.5, fontWeight: "700", marginBottom: 12 },
  welcomeTitle: { color: "#FFFFFF", fontSize: 20, fontWeight: "800", lineHeight: 27 },
  welcomeText: { color: "#D7E3FF", fontSize: 11, lineHeight: 17, marginTop: 9, maxWidth: 230 },
  welcomeIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#FFFFFF20",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    marginTop: 5,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: COLORS.text },
  sectionAction: { fontSize: 12, color: COLORS.primary, fontWeight: "700" },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 23 },
  statCard: {
    width: "48%",
    flexGrow: 1,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 14,
  },
  statIcon: { width: 37, height: 37, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  statValue: { fontSize: 27, fontWeight: "800", color: COLORS.text, marginTop: 10 },
  statLabel: { fontSize: 11, color: COLORS.muted, marginTop: 3 },
  projectCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 15,
    gap: 12,
    marginBottom: 11,
  },
  projectIcon: { width: 47, height: 47, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  projectName: { fontSize: 14, fontWeight: "800", color: COLORS.text },
  projectMeta: { fontSize: 11, color: COLORS.muted, marginTop: 5 },
  progressTrack: { height: 5, backgroundColor: "#EEF1F6", borderRadius: 4, marginTop: 10, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 4 },
  projectPicker: { marginBottom: 12, flexGrow: 0 },
  projectChip: {
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: 9,
    marginRight: 8,
  },
  projectChipActive: { backgroundColor: COLORS.blueLight, borderColor: "#B8CCFF" },
  projectChipText: { fontSize: 11, fontWeight: "600", color: COLORS.muted },
  projectChipTextActive: { color: COLORS.primary },
  filterRow: { marginBottom: 15, flexGrow: 0 },
  filterChip: {
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginRight: 7,
  },
  filterChipActive: { backgroundColor: COLORS.text, borderColor: COLORS.text },
  filterText: { color: COLORS.muted, fontSize: 11, fontWeight: "600" },
  filterTextActive: { color: COLORS.white },
  boardColumn: { marginBottom: 17 },
  columnHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 11 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  columnTitle: { color: COLORS.text, fontSize: 14, fontWeight: "800" },
  countBadge: { backgroundColor: "#E9EDF4", paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  countText: { fontSize: 10, color: COLORS.muted, fontWeight: "700" },
  taskCard: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 13,
    padding: 14,
    marginBottom: 10,
  },
  taskTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  taskProject: { flexDirection: "row", alignItems: "center", gap: 7, flex: 1, marginRight: 8 },
  projectMiniDot: { width: 7, height: 7, borderRadius: 4 },
  taskProjectText: { fontSize: 10, color: COLORS.muted, fontWeight: "600", flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: "800", color: COLORS.text, marginTop: 11, lineHeight: 20 },
  taskDescription: { fontSize: 11, lineHeight: 17, color: COLORS.muted, marginTop: 6 },
  taskMetaRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 13 },
  priorityBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 6, paddingHorizontal: 8, paddingVertical: 5 },
  priorityDot: { width: 5, height: 5, borderRadius: 3 },
  priorityText: { fontSize: 10, fontWeight: "700" },
  assigneeAvatar: { width: 28, height: 28, borderRadius: 14, backgroundColor: "#E9E5FF", justifyContent: "center", alignItems: "center" },
  assigneeText: { fontSize: 11, fontWeight: "800", color: "#6D4BC3" },
  taskFooter: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 12 },
  taskFooterItem: { flexDirection: "row", alignItems: "center", gap: 4, flexShrink: 1 },
  taskFooterText: { fontSize: 10, color: COLORS.muted, flexShrink: 1 },
  moveButton: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    marginTop: 12,
    paddingTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  moveButtonText: { color: COLORS.primary, fontSize: 11, fontWeight: "700" },
  taskMenu: { backgroundColor: "#F8FAFF", borderRadius: 9, padding: 5, marginTop: 7, borderWidth: 1, borderColor: COLORS.border },
  menuOption: { padding: 9 },
  menuText: { fontSize: 12, color: COLORS.text, fontWeight: "600" },
  emptyColumn: { padding: 26, borderWidth: 1, borderColor: COLORS.border, borderStyle: "dashed", borderRadius: 12, alignItems: "center", backgroundColor: COLORS.white },
  emptyText: { fontSize: 12, color: COLORS.muted, marginTop: 8 },
  bottomNav: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 8,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 5, gap: 4 },
  navLabel: { fontSize: 9, color: COLORS.muted, fontWeight: "600" },
  navLabelActive: { color: COLORS.primary, fontWeight: "800" },
  navIndicator: { width: 17, height: 3, borderRadius: 2, backgroundColor: COLORS.primary, position: "absolute", top: -8 },
  modalBackdrop: { flex: 1, backgroundColor: "#11182788", justifyContent: "flex-end" },
  modalCard: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingHorizontal: 20,
    paddingTop: 23,
    paddingBottom: 30,
    maxHeight: "92%",
  },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 22 },
  modalTitle: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  modalSubtitle: { fontSize: 12, color: COLORS.muted, marginTop: 5 },
  closeButton: { width: 37, height: 37, borderRadius: 12, backgroundColor: COLORS.background, alignItems: "center", justifyContent: "center" },
  inputLabel: { fontSize: 10, color: COLORS.muted, fontWeight: "800", letterSpacing: 1, marginBottom: 8, marginTop: 16 },
  input: { minHeight: 46, borderWidth: 1, borderColor: COLORS.border, borderRadius: 10, paddingHorizontal: 12, color: COLORS.text, fontSize: 13, backgroundColor: COLORS.white },
  multiline: { minHeight: 85, paddingTop: 12, textAlignVertical: "top" },
  optionRow: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  choice: { borderWidth: 1, borderColor: COLORS.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 9, backgroundColor: COLORS.white },
  choiceActive: { backgroundColor: COLORS.blueLight, borderColor: COLORS.primary },
  choiceText: { fontSize: 11, color: COLORS.muted, fontWeight: "600" },
  choiceTextActive: { color: COLORS.primary, fontWeight: "800" },
  saveButton: { height: 49, borderRadius: 11, backgroundColor: COLORS.primary, justifyContent: "center", alignItems: "center", marginTop: 24 },
  saveButtonText: { color: COLORS.white, fontSize: 13, fontWeight: "800" },
  deleteButton: { height: 45, justifyContent: "center", alignItems: "center", marginTop: 5 },
  deleteButtonText: { color: COLORS.red, fontSize: 12, fontWeight: "700" },
});
