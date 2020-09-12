import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import ReactHtmlParser from 'react-html-parser';
import { Stack, Button } from '@kiwicom/orbit-components/lib';
import styled from 'styled-components';
import Filter from '../modules/Filter';
import api from '@api';
import { LEGAL_TYPE } from '@constants/legal';

const Container = styled.div`
  flex: 1;
`;

const Frame = styled.div`
  border-width: 1px;
  border: 1px solid black;
  padding: 5px;
`;

const EditorFrame = styled.div`
  max-height: 78vh;
  overflow: auto;
`;

const LegalPage = () => {
  const [filter, setFilter] = useState(LEGAL_TYPE.PRIVACY_POLICY);
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ align: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      [{ color: [] }, { background: [] }],
      ['link'],
      ['clean'],
    ],
  };

  useEffect(() => {
    api.legal
      .get(filter)
      .then((dataSnapshot) => {
        if (dataSnapshot.exists) {
          setValue(dataSnapshot.data().content);
        } else {
          setValue('');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [filter]);

  const selectedFilter = (filter) => {
    setFilter(filter);
  };

  const saveLegalDocument = (content) => {
    setSaving(true);
    api.legal
      .update(content, filter)
      .then((data) => {})
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setSaving(false);
      });
  };

  return (
    <Stack>
      <Stack justify="between" direction="row">
        <Filter onSelectedFilter={selectedFilter} />
        <Button loading={saving} onClick={() => saveLegalDocument(value)}>
          Save
        </Button>
      </Stack>

      <Stack direction="row">
        <Container>
          <ReactQuill style={{ height: '75vh' }} theme="snow" value={value} modules={modules} onChange={setValue} />
        </Container>
        <Container>
          <Frame>
            <EditorFrame>
              <div className="ql-editor">{ReactHtmlParser(value)}</div>
            </EditorFrame>
          </Frame>
        </Container>
      </Stack>
    </Stack>
  );
};

export default LegalPage;
