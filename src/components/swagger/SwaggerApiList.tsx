const urlList = [
  { name: "petstore", url: "https://petstore.swagger.io/v2/swagger.json" },
  { name: "petstore yml", url: "https://petstore.swagger.io/v2/swagger.yaml" },
];

type Props = {
  handlePageChange: (pageState: "editor" | "viewer", url: string) => void;
};

export default function SwaggerApiList(props: Props) {
  return (
    <div className="max-w-xl w-[90%] mx-auto mt-8 flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-center mb-2">
        Swagger API 문서 리스트
      </h2>
      {urlList.map(({ name, url }) => (
        <div
          key={url}
          className="flex justify-between items-center bg-white border border-gray-200 rounded-lg shadow-xs px-6 py-4"
        >
          <span className="font-semibold mb-1 text-gray-800">{name}</span>
          <div className="flex gap-2 [&>*]:rounded-md [&>*]:text-xs [&>*]:font-bold [&>*]:shadow [&>*]:p-1 [&>*]:hover:translate-y-1 [&>*]:transition">
            <button
              className="text-blue-500"
              onClick={() => props.handlePageChange("editor", url)}
            >
              editor
            </button>
            <button
              className="text-blue-500"
              onClick={() => props.handlePageChange("viewer", url)}
            >
              viewer
            </button>
            <button className="text-red-500">delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}
