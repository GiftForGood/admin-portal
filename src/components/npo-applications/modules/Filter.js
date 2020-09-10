import React, { useState } from 'react';
import { STATUS_FILTER_TYPE } from '@constants/npoVerification';
import { Popover, Button, ListChoice } from '@kiwicom/orbit-components/';
import { ChevronDown } from '@kiwicom/orbit-components/lib/icons';

const Filter = ({ onSelectedFilter }) => {
  const [currentFilter, setCurrentFilter] = useState(STATUS_FILTER_TYPE.PENDING);

  return (
    <Popover
      content={
        <div>
          {Object.values(STATUS_FILTER_TYPE).map((status) => (
            <ListChoice
              title={status.toUpperCase()}
              onClick={() => {
                setCurrentFilter(status.toUpperCase());
                onSelectedFilter(status);
              }}
            />
          ))}
        </div>
      }
      noPadding
      preferredPosition="bottom"
    >
      <Button size="normal" iconRight={<ChevronDown />}>
        {currentFilter.toUpperCase()}
      </Button>
    </Popover>
  );
};

export default Filter;
