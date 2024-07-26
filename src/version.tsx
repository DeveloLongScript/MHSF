export const version = "b-0.5";

const User = ({ user }: { user: string }) => (
  <span className="cursor-pointer bg-[rgba(255,165,0,0.25);] rounded p-[2.5px]">
    @Tarna
  </span>
);

export const Changelog = () => (
  <>
    <div>
      <strong className="flex items-center">
        Version b-0.4.5 (July 26th 2024):
      </strong>
      <ul>
        <li>• Made charts better</li>
        <li>• Sorted API endpoints</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.4 (July 24th 2024):
      </strong>
      <ul>
        <li>• Added Info button</li>
        <li>• Fixed Clerk in production</li>
        <li>• Added Turbo for faster builds</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.3 (July 23th 2024):
      </strong>
      <ul>
        <li>
          • Fixed minor bugs described by <User user="@Tarna" />
        </li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.2 (July 23th 2024):
      </strong>
      <ul>
        <li>• Inital release!</li>
      </ul>
    </div>
  </>
);
