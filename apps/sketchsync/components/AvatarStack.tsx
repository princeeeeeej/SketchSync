
interface User {
  id: string;
  name: string;
}


const avatarColors = [
  "bg-blue-500", "bg-emerald-500", "bg-violet-500", 
  "bg-rose-500", "bg-amber-500", "bg-cyan-500"
];

const getInitials = (name: string) => {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
};


const getColor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return avatarColors[Math.abs(hash) % avatarColors.length];
};

export const AvatarStack = ({ users, currentUserId }: { users: User[], currentUserId: string }) => {
  if (users.length === 0) return null;

  return (
    <div className="absolute top-6 right-6 flex items-center z-50">
      <div className="flex items-center -space-x-2">
        {users.map((user) => (
          <div 
            key={user.id} 
            className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 border-[#09090b] text-[11px] font-bold text-white shadow-sm group cursor-default ${getColor(user.id)}`}
          >
            {getInitials(user.name)}

            <div className="absolute top-10 whitespace-nowrap bg-zinc-800 text-zinc-200 text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              {user.id === currentUserId ? `${user.name} (You)` : user.name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};