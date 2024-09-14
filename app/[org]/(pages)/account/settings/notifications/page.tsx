import React from 'react';

import { Button, Switch } from '@fucina/ui';

function SettingsNotifications() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="border-default bg-card border rounded-lg w-full">
        <div className="p-6 border-b border-b-default">
          <h2 className="text-heading-subsection">Notifications</h2>
          <p className="text-description text-md">
            Manage your personal notification settings.
          </p>
        </div>
        <div className="flex flex-col gap-4 p-6 w-full">
          <div className="flex justify-between items-center w-full">
            <p className="text-md-medium">Weekly Digest</p>
            <Switch checked={true} />
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-md-medium">When someone votes on your Idea</p>
            <Switch checked={true} />
          </div>
          <div className="flex justify-between items-center w-full">
            <p className="text-md-medium">When someone comments on your Idea</p>
            <Switch />
          </div>
        </div>
        <div className="flex justify-end items-center border-default px-6 py-4 border-t w-full">
          <Button variant="primary">Save</Button>
        </div>
      </div>
    </div>
  );
}

export default SettingsNotifications;
