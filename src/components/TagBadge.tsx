interface TagBadgeProps {
  tag: 'Manga' | 'Anime' | 'Light Novel';
  mobile?: boolean;
}

const tagColors = {
  Manga: { bg: '#FFE8E8', text: '#C44545' },
  Anime: { bg: '#E8F4FF', text: '#4573C4' },
  'Light Novel': { bg: '#F4E8FF', text: '#8845C4' },
};

export function TagBadge({ tag, mobile = false }: TagBadgeProps) {
  const colors = tagColors[tag];

  const getShortText = () => {
    if (!mobile) return tag;
    switch (tag) {
      case 'Anime':
        return 'A';
      case 'Manga':
        return 'M';
      case 'Light Novel':
        return 'LN';
      default:
        return tag;
    }
  };

  return (
    <span
      className="px-2 py-0.5 rounded-md text-xs font-['Inter',sans-serif]"
      style={{
        backgroundColor: colors.bg,
        color: colors.text,
        fontWeight: 500,
      }}
    >
      {getShortText()}
    </span>
  );
}
