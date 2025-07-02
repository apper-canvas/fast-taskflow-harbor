import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "@/components/molecules/TaskCard";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Loading from "@/components/ui/Loading";

const TaskList = ({ 
  tasks, 
  loading, 
  error, 
  onToggleComplete, 
  onEditTask, 
  onDeleteTask,
  onRetry 
}) => {
  if (loading) {
    return <Loading />;
  }
  
  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }
  
  if (!tasks || tasks.length === 0) {
    return <Empty />;
  }
  
return (
    <div className="space-y-4">
      <SortableContext items={tasks.map(task => task.Id)} strategy={verticalListSortingStrategy}>
        <AnimatePresence mode="popLayout">
          {tasks.map((task) => (
            <TaskCard
              key={task.Id}
              task={task}
              onToggleComplete={onToggleComplete}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </AnimatePresence>
      </SortableContext>
    </div>
  );
};

export default TaskList;