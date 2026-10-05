import Link from "next/link";
import UserAvatar from "@/components/common/UserAvatar";
import { useCommentActions } from "@/components/comment/useCommentActions";
import useCommentRating from "@/hooks/useCommentRating";

// Type สำหรับข้อมูลใน Comment
interface Comment {
  comment_id: string;
  author: {
    display_name: string;
    profile_picture: string;
  };
  text: string;
  created_at: string; // ควรเป็น ISO Date string หรือ formatted string
  likes: number;
  dislikes: number;
}

interface TopCommentProps {
  comment: Comment;
  href: string; // the post this comment belongs to
}

const TopComment = ({ comment, href }: TopCommentProps) => {
  const { rating: myRating } = useCommentRating(comment.comment_id);
  const myLikeStatus =
    myRating === "like" ? "liked" : myRating === "dislike" ? "disliked" : "none";
  const { likes, dislikes, userLikeStatus, toggleLike, toggleDislike } =
    useCommentActions(
      comment.comment_id,
      Number(comment.likes) || 0,
      Number(comment.dislikes) || 0,
      false,
      undefined,
      myLikeStatus
    );

  // ฟังก์ชันแปลงเวลาคร่าวๆ (ตัวอย่าง) // ในโปรเจกต์จริงควรใช้ library เช่น date-fns
  const formatTimeAgo = (dateString: string) => {
  if (!dateString) return "";

  const now = new Date();
  const commentDate = new Date(dateString);
  
  // ตรวจสอบว่า Date ถูกต้องหรือไม่
  if (isNaN(commentDate.getTime())) {
    console.error("Invalid date string:", dateString);
    return ""; // หรือ return ค่า default
  }

  const seconds = Math.floor((now.getTime() - commentDate.getTime()) / 1000);

  if (seconds < 0) {
    // กรณีเวลาในอนาคต (อาจเกิดจาก time sync)
    return "just now";
  }
  if (seconds < 60) {
    return seconds <= 1 ? "1 s ago" : `${seconds} s ago`;
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return minutes === 1 ? "1 m ago" : `${minutes} m ago`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return hours === 1 ? "1 h ago" : `${hours} h ago`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return days === 1 ? "1 d ago" : `${days} d ago`;
  }
  
  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return weeks === 1 ? "1 w ago" : `${weeks} w ago`;
  }
  
  const months = Math.floor(days / 30); // ประมาณค่า
  if (months < 12) {
    return months === 1 ? "1 mo ago" : `${months} mo ago`;
  }

  const years = Math.floor(days / 365); // ประมาณค่า
  return years === 1 ? "1 y ago" : `${years} y ago`;
  };

  return (
    <div className="flex items-start gap-3">
      {/* Comment body opens the post; vote buttons sit outside the link */}
      <Link href={href} className="flex items-start gap-3 flex-grow min-w-0 cursor-pointer">
        <UserAvatar name={comment.author.display_name} src={comment.author.profile_picture} size={32} />
        <div className="flex-grow min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-dark-900">{comment.author.display_name}</span>
            <span className="text-xs text-gray-400">{formatTimeAgo(comment.created_at)}</span>
          </div>
          <p className="text-gray-600 mt-1">{comment.text}</p>
        </div>
      </Link>
      <div className="flex items-center gap-2 text-gray-500">
        <button
          onClick={toggleLike}
          aria-label="Like comment"
          aria-pressed={userLikeStatus === "liked"}
          className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={userLikeStatus === "liked" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 10v12" /><path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a2 2 0 0 1 1.79 1.11L15 5.88Z" /></svg>
        </button>
        <span className="text-sm font-bold">{likes}</span>

        <button
          onClick={toggleDislike}
          aria-label="Dislike comment"
          aria-pressed={userLikeStatus === "disliked"}
          className="p-1 rounded-full hover:bg-gray-100 cursor-pointer"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={userLikeStatus === "disliked" ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 14V2" /><path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22h0a2 2 0 0 1-1.79-1.11L9 18.12Z" /></svg>
        </button>
        <span className="text-sm font-bold">{dislikes}</span>
      </div>
    </div>
  );
};

export default TopComment;