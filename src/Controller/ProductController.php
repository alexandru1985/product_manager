<?php
  
namespace App\Controller;
  
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use App\Entity\Product;
  
/**
 * @Route("/api")
 */
class ProductController extends AbstractController
{
    /**
     * @Route("/products", methods={"GET"})
     * 
     * @return Response
     */
    public function index(): Response
    {
        $products = $this->getDoctrine()
            ->getRepository(Product::class)
            ->getProducts();
  
        $data = [];
  
        foreach ($products as $product) {
            $data[] = [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'description' => $product->getDescription(),
           ];
        }

        return $this->json($data, 200);
    }
  
    /**
     * @Route("/products", methods={"POST"})
     * 
     * @param Request $request
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function create(Request $request, ValidatorInterface $validator): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $content = json_decode($request->getContent());
         
        $product = new Product();
        $product->setName($content->name);
        $product->setDescription($content->description);
        $formErrors = $this->validateForm($validator, $product); 

        if ($formErrors) {
            return $this->json($formErrors);
        }

        $entityManager->persist($product);
        $entityManager->flush();
  
        return $this->json([
            "message" => 'Created new product successfully with id ' . $product->getId()
        ], 201);
    }
  
    /**
     * @Route("/products/{id}", methods={"GET"})
     * 
     * @param int $id
     * @return Response
     */
    public function show(int $id): Response
    {
        $product = $this->getDoctrine()
            ->getRepository(Product::class)
            ->find($id);
  
        if (!$product) {
            return $this->json([
                "message" => "No product found for id " . $id 
            ], 404);
        }
  
        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
        ];
          
        return $this->json($data, 200);
    }
  
    /**
     * @Route("/products/{id}", methods={"PUT", "PATCH"})
     * 
     * @param Request $request
     * @param int $id
     * @param ValidatorInterface $validator
     * @return Response
     */
    public function update(Request $request, int $id, ValidatorInterface $validator): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $product = $entityManager->getRepository(Product::class)->find($id);
  
        if (!$product) {
            return $this->json([
                "message" => "No product found for id " . $id 
            ], 404);
        }
         
        $content = json_decode($request->getContent());
         
        $product->setName($content->name);
        $product->setDescription($content->description);
        $formErrors = $this->validateForm($validator, $product); 

        if ($formErrors) {
            return $this->json($formErrors);
        }

        $entityManager->flush();
  
        $data = [
            'id' => $product->getId(),
            'name' => $product->getName(),
            'description' => $product->getDescription(),
        ];
          
        return $this->json([
            "message" => 'Product updated successfully with id ' . $product->getId()
        ], 200);
    }
  
    /**
     * @Route("/products/{id}", methods={"DELETE"})
     * 
     * @param int $id
     * @return Response
     */
    public function delete(int $id): Response
    {
        $entityManager = $this->getDoctrine()->getManager();
        $product = $entityManager->getRepository(Product::class)->find($id);
  
        if (!$product) {
            return $this->json([
                "message" => "No product found for id " . $id 
            ], 404);
        }
  
        $entityManager->remove($product);
        $entityManager->flush();
  
        return $this->json([
            "message" => 'Product deleted successfully with id ' . $id
        ], 200);
    }

    /**
     * @Route("/products/{id}", methods={"PUT", "PATCH"})
     * 
     * @param ValidatorInterface $validator
     * @param Product $product
     * @return array
     */
    public function validateForm(ValidatorInterface $validator, Product $product): array
    {
        $nameError = $validator->validateProperty($product, 'name');
        $descriptionError = $validator->validateProperty($product, 'description');
        $formErrors = [];

        if(count($nameError) > 0) {
            $formErrors['name'] = $nameError[0]->getMessage();
        }

        if(count($descriptionError) > 0) {
            $formErrors['description'] = $descriptionError[0]->getMessage();
        }

        if ($formErrors) {
            $formErrors['errors'] = true;
        }

        return $formErrors;
    }
}