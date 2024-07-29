type TagOverlayProps = {
  tags: string[];
};

const TagOverlay: React.FC<TagOverlayProps> = ({tags}) => {
  return (
    <div className="absolute top-0 left-0 p-2 grid grid-cols-2 gap-1">
      {tags
        .filter(
          (tag) =>
            tag.toLowerCase() === 'exclusive' ||
            tag.toLowerCase() === 'pre-order' ||
            tag.toLowerCase() === 'out of stock',
        )
        .map((tag, index) => (
          <span
            key={index}
            className="bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded"
          >
            {tag}
          </span>
        ))}
    </div>
  );
};

export default TagOverlay;
