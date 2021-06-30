import React, { useCallback, useMemo, useState } from 'react';
import { Row, Col, Modal, Form, Input, Typography, Button } from 'antd';

import { useFetch } from 'services/hooks';

const { Title } = Typography;

const CategoriesCreate = ({ refreshList }) => {
  const [form] = Form.useForm();
  const { post, loading } = useFetch();

  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(0);
  const [, setFormValues] = useState({});

  const closeModal = useCallback(() => {
    setModalVisible(false);

    setTimeout(() => {
      form.resetFields();
      setPage(0);
      setFormValues({});
    }, 500);
  }, [form, setFormValues]);

  const openModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  // const showWarning = useCallback(async () => {
  //   await form.validateFields();

  //   setFormValues(form.getFieldsValue());

  //   setPage(1);
  // }, [form]);

  const handleSubmit = useCallback(async () => {
    await form.validateFields();

    const values = form.getFieldsValue();
    setFormValues(values);

    await post({
      url: `/categories`,
      payload: {
        ...values,
      },
    });

    refreshList();
    closeModal();
  }, [closeModal, form, post, refreshList, setFormValues]);

  const formContent = useMemo(
    () =>
      page === 0 && (
        <Row>
          <Col span={24}>
            <Title>Nova categoria</Title>
          </Col>

          <Col span={24} className="mrg-vertical-20">
            <Form
              form={form}
              layout="vertical"
              // onFinish={handleSubmit}
              autoComplete="off"
            >
              <Form.Item label="Nome" name="name" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item label="Cor" name="color" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            </Form>
          </Col>

          <Col span={24} className="flex end">
            <Button
              type="primary"
              htmlType="button"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            >
              Criar
            </Button>
          </Col>
        </Row>
      ),
    [page, form, handleSubmit, loading]
  );

  // const warningContent = useMemo(() => {
  //   return (
  //     page === 1 && (
  //       <div className="flex center fd-column mrg-vertical-20">
  //         <i className="caf-ic_alert-triangle font-size-100 warning-color" />
  //         <Title level={3}>Atenção</Title>
  //         <Paragraph>
  //           Ao importar o arquivo sua lista de restrições atual será sobrescrita.
  //         </Paragraph>

  //         <div span={24} className="flex center fd-row mrg-top-15">
  //           <Button type="danger" htmlType="button" onClick={closeModal}>
  //             Cancelar
  //           </Button>
  //           <Button
  //             type="primary"
  //             htmlType="button"
  //             onClick={handleSubmit}
  //             disabled={loading}
  //           >
  //             {loading ? 'Enviando...' : 'Continuar'}
  //           </Button>
  //         </div>
  //       </div>
  //     )
  //   );
  // }, [page, closeModal, handleSubmit, loading]);

  const CategoriesCreateModal = useMemo(
    () => (
      <Modal
        visible={modalVisible}
        wrapClassName="caf-modal"
        closable
        // closeIcon={<i className="caf-ic_close font-size-18" />}
        onCancel={closeModal}
        footer={null}
        width={650}
      >
        {formContent}
      </Modal>
    ),
    [modalVisible, closeModal, formContent]
  );

  return { openModal, closeModal, CategoriesCreateModal };
};

export default CategoriesCreate;
