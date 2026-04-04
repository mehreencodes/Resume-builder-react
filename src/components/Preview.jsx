export default function Preview({ data }) {
  return (
    <div className="resume">
      <h1>{data.name}</h1>
      <h3>{data.title}</h3>

      <p><b>Email:</b> {data.email}</p>
      <p><b>Phone:</b> {data.phone}</p>

      <hr />

      <h2>Summary</h2>
      <p>{data.summary}</p>
    </div>
  );
}