import { NbMenuItem }
  from '@nebular/theme';

export const MENU_ADMIN: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    link: '/pages/home',
  },
  {
    title: 'Perfil',
    icon: 'person-outline',
    link: '/pages/perfil',
  },
  {
    title: 'Reclutamiento y Selección',
    icon: 'people-outline',
    children:
      [
        {
          title: 'Publicar Plazas',
          link: '/pages/reclutamiento-y-seleccion/plazas-vacantes',
        },
        {
          title: 'Plazas Vacantes',
          link: '/pages/reclutamiento-y-seleccion/plazas-vacantes-postulantes',
        },
      ],
  },
  {
    title: 'Solicitudes',
    icon: 'file-text-outline',
    children:
      [
        {
          title: 'Solicitar Constancia',
          link: '/pages/solicitudes/solicitar_constancia',
        },
        {
          title: 'Solicitar Vacación',
          link: '/pages/solicitudes/solicitar_vacacion',
        },
        {
          title: 'Constancias Solicitadas',
          link: '/pages/solicitudes/constancias_solicitadas',
        },
        {
          title: 'Vacaciones Solicitadas',
          link: '/pages/solicitudes/vacaciones_solicitadas',
        },
        {
          title: 'Deducciones por Planilla',
          link: '/pages/solicitudes/deduccion_planilla',
        },
      ],
  },
  {
    title: 'Encuestas',
    icon: 'layout-outline',
    children:
      [
        {
          title: 'Generador de Encuestas',
          link: '/pages/encuesta/encuesta-creator',
        },
        {
          title: 'Encuestas Activas',
          link: '/pages/encuesta/encuestas-habiitadas',
        },
        {
          title: 'Tabulación de Encuestas',
          link: '/pages/encuesta/encuestas-tabulacion',
        },
      ],
  },
  {
    title: 'Quejas, Sugerencias y Denuncias',
    icon: 'layers-outline',
    children:[
      {
        title: 'Admin',
        link: '/pages/quejas-sugerencias-denuncias-admin',
      },
      {
        title: 'Participar',
        link: '/pages/quejas-sugerencias-denuncias',
      }
    ],
  },
  {
    title: 'Configuración',
    icon: 'settings-2-outline',
    children:
      [
        {
          title: 'Admin Noticias',
          // icon:'bell-outline',
          link: '/pages/configuracion/admin-noticias',
        },
        // {
        //   title: 'Admin Grupos de Formatos',
        //   // icon:'bell-outline',
        //   link: '/pages/configuracion/admin-grupos-formatos',
        // },
        {
          title: 'Roles de Usuario',
          link: '/pages/configuracion/roles-usuarios',
        },
        {
          title: 'Repositorio de Formatos',
          // icon:'archive-outline',
          link: '/pages/configuracion/admin-repositorio-formatos',
        },
        {
          title: 'Políticas y Procedimientos',
          // icon:'archive-outline',
          link: '/pages/configuracion/admin-repositorio-politicas',
        }
      ],
  }
]

export const MENU_USER: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    link: '/pages/home',
  },
  {
    title: 'Perfil',
    icon: 'person-outline',
    link: '/pages/perfil',
  },
  {
    title: 'Solicitudes',
    icon: 'file-text-outline',
    children:
      [
        {
          title: 'Solicitar Constancia',
          link: '/pages/solicitudes/solicitar_constancia',
        },
        {
          title: 'Solicitar Vacación',
          link: '/pages/solicitudes/solicitar_vacacion',
        },
      ],
  },
  {
    title: 'Encuestas',
    icon: 'layout-outline',
    children:
      [
        {
          title: 'Encuestas Activas',
          link: '/pages/encuesta/encuestas-habiitadas',
        },
      ],
  },
  {
    title: 'Reclutamiento y Selección',
    icon: 'people-outline',
    children:
      [
        {
          title: 'Plazas Vacantes',
          link: '/pages/reclutamiento-y-seleccion/plazas-vacantes-postulantes',
        },
      ],
  },
  {
    title: 'Quejas, Sugerencias y Denuncias',
    icon: 'layers-outline',
    link: '/pages/quejas-sugerencias-denuncias',
  },
  {
    title: 'Repositorio de Formatos',
    icon:'archive-outline',
    link: '/pages/configuracion/repositorio-formatos',
  },
  {
    title: 'Políticas y Procedimientos',
    icon:'archive-outline',
    link: '/pages/configuracion/repositorio-politicas',
  }
]


export const MENU_JEFE: NbMenuItem[] = [
  {
    title: 'Home',
    icon: 'home',
    link: '/pages/home',
  },
  {
    title: 'Perfil',
    icon: 'person-outline',
    link: '/pages/perfil',
  }, 
  {
    title: 'Solicitudes',
    icon: 'file-text-outline',
    children:
      [
        {
          title: 'Solicitar Constancia',
          link: '/pages/solicitudes/solicitar_constancia',
        },
        {
          title: 'Solicitar Vacación',
          link: '/pages/solicitudes/solicitar_vacacion',
        },
        {
          title: 'Vacaciones Solicitadas',
          link: '/pages/solicitudes/vacaciones_solicitadas',
        },
      ],
    },
    {
      title: 'Encuestas',
      icon: 'layout-outline',
      children:
        [
          {
            title: 'Encuestas Activas',
            link: '/pages/encuesta/encuestas-habiitadas',
          },
        ],
    }, 
    {
    title: 'Reclutamiento y Selección',
    icon: 'people-outline',
    children:
      [
        {
          title: 'Plazas Vacantes',
          link: '/pages/reclutamiento-y-seleccion/plazas-vacantes-postulantes',
        },
      ],
  },
  {
    title: 'Quejas, Sugerencias y Denuncias',
    icon: 'layers-outline',
    link: '/pages/quejas-sugerencias-denuncias',
  }  ,
  {
    title: 'Repositorio de Formatos',
    icon:'archive-outline',
    link: '/pages/configuracion/repositorio-formatos',
  },
  {
    title: 'Políticas y Procedimientos',
    icon:'archive-outline',
    link: '/pages/configuracion/repositorio-politicas',
  }
]


export const MENU_ITEMS: NbMenuItem[] = [
];
