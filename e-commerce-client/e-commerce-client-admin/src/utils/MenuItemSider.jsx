import {
  AiOutlineBgColors,
  AiOutlineShoppingCart,
  AiOutlineUser
} from 'react-icons/ai';
import { CgListTree } from 'react-icons/cg';
import { FaBloggerB, FaClipboardList } from 'react-icons/fa';
import { MdCategory } from 'react-icons/md';
import { RiCouponLine } from 'react-icons/ri';
import { TbBrandAirtable } from 'react-icons/tb';

export const MenuItemSider = [
  {
    key: '/',
    icon: <AiOutlineUser />,
    label: 'Khách hàng'
  },
  {
    icon: <CgListTree />,
    label: 'Sản phẩm',
    children: [
      {
        key: '/san-pham',
        icon: <AiOutlineShoppingCart className='fs-4' />,
        label: 'Sản phẩm'
      },
      {
        key: '/danh-muc-san-pham',
        icon: <MdCategory />,
        label: 'Danh mục'
      },
      {
        key: '/thuong-hieu',
        icon: <TbBrandAirtable />,
        label: 'Thương hiệu'
      },

      {
        key: '/mau-sac',
        icon: <AiOutlineBgColors />,
        label: 'Màu sắc'
      }
    ]
  },
  {
    key: '/don-dat-hang',
    icon: <FaClipboardList />,
    label: 'Đơn đặt hàng'
  },
  {
    key: '/phieu-giam-gia',
    icon: <RiCouponLine />,
    label: 'Phiếu giảm giá'
  },
  {
    icon: <CgListTree />,
    label: 'Bài viết',
    children: [
      {
        key: '/bai-viet',
        icon: <FaBloggerB className='fs-4' />,
        label: 'Bài viết'
      },
      {
        key: '/danh-muc-bai-viet',
        icon: <MdCategory />,
        label: 'Danh mục'
      }
    ]
  }
];
