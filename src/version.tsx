export const version = "b-0.7.0";

const User = ({ user }: { user: string }) => (
  <span className="cursor-pointer bg-[rgba(255,165,0,0.25);] rounded p-[2.5px]">
    {user}
  </span>
);

export const Changelog = () => (
  <>
    <div>
      <strong className="flex items-center">
        Version b-0.7.0 (August 7th 2024)
      </strong>
      <ul>
        <li>• Added customization to servers</li>
        <li>• New button focus effect</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
    <div>
      <strong className="flex items-center">
        Version b-0.6.0 (August 3rd 2024)
      </strong>
      <ul>
        <li>• Enhanced shortcuts</li>
        <li>• Added gradient beam to player count</li>
        <li>• Updated loading animations</li>
        <li>• Lots of bugfixes</li>
      </ul>
    </div>
    <br />
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
        Version b-0.4 (July 25th 2024):
      </strong>
      <ul>
        <li>• Added Info button</li>
        <li>• Fixed Clerk in production</li>
        <li>• Added Turbo for faster builds</li>
        <li>
          • <strong>Added historical data</strong>
        </li>
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
