import styled from "styled-components";

export const ActionButton = styled.button`
  display: inline-flex;
  min-height: 38px;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 0 16px;
  border: 1px solid #dfe6d7;
  border-radius: 5px;
  color: #1d2522;
  background: #fff;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
  transition: border-color 160ms ease, background 160ms ease, transform 160ms ease;

  &:hover {
    border-color: #c3ef80;
    background: #eef9dc;
    transform: translateY(-1px);
  }

  &:focus-visible {
    outline: 3px solid #8fbb51;
    outline-offset: 3px;
  }
`;

export const EditButton = styled(ActionButton)`
  border-color: #dfe6d7;
`;

export const DeleteButton = styled(ActionButton)`
  border-color: #dcbab4;
  color: #8a3e34;

  &:hover {
    border-color: #efaaa0;
    background: #fff0ed;
  }
`;
